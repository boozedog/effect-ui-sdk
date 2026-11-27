// Generates the typed Effect UI bindings from the manifest `@ui-sdk/web` ships.
//
//   node scripts/generate.mjs                  Write src/entries and src/index.ts.
//   node scripts/generate.mjs --check          Fail when the files on disk are stale.
//   node scripts/generate.mjs --manifest <p>   Read another manifest.
//
// The manifest is the Custom Elements Manifest published at
// `@ui-sdk/web/custom-elements.json`, so the bindings cannot drift from the
// tags, properties and events that shipped. Registration is a side effect of
// importing an entry, exactly as it is for `@ui-sdk/web/<entry>`, which is why
// every generated entry starts with that import.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(here, "..")
const sourceDir = path.join(packageDir, "src")
const entriesDir = path.join(sourceDir, "entries")
const require = createRequire(import.meta.url)

const args = process.argv.slice(2)
const check = args.includes("--check")
const manifestFlag = args.indexOf("--manifest")
const manifestPath =
  manifestFlag >= 0
    ? path.resolve(args[manifestFlag + 1])
    : path.join(path.dirname(require.resolve("@ui-sdk/web/package.json")), "custom-elements.json")

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
const webPackage = JSON.parse(
  readFileSync(path.join(path.dirname(manifestPath), "package.json"), "utf8")
)
const webVersion = webPackage.version
const webExports = new Set(Object.keys(webPackage.exports ?? {}))

// Handles the element exposes for other code to drive it. They are objects and
// functions, not options, so a view never sets them: writing one would fight
// the controller the element owns.
const excludedProperties = new Set(["api", "controller"])

const HEADER = [
  "// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.",
  "// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.",
].join("\n")

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)
const words = (value) => value.split(/[-_.]/).filter(Boolean)

function pascal(value) {
  return words(value)
    .map((word) => (word === "otp" ? "OTP" : capitalize(word)))
    .join("")
}

// The export a tag gets inside its entry's namespace: `ui-toggle` in `toggle`
// is `Root`, `ui-tabs-list` in `tabs` is `List`, and a tag that belongs to no
// entry keeps its whole name (`ui-overlay-host` is `OverlayHost`).
function exportName(tagName, entry) {
  const short = tagName.replace(/^ui-/, "")
  if (short === entry) return "Root"
  const prefix = `${entry}-`
  if (short.startsWith(prefix)) return pascal(short.slice(prefix.length))
  return pascal(short)
}

function key(name) {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name)
}

function quote(value) {
  return JSON.stringify(value)
}

// ---------------------------------------------------------------------------
// Type text -> the narrowest Effect Schema that provably accepts it
// ---------------------------------------------------------------------------

// Anything with a generic, an element, a function or a template literal stays
// `Schema.Unknown`: the binding still works and the value is written as given,
// the caller just gets no narrowing.
function schemaOf(typeText) {
  const text = stripOuterParens(String(typeText ?? "unknown").trim().replace(/\s+/g, " "))
  const simple = {
    boolean: "Schema.Boolean",
    string: "Schema.String",
    number: "Schema.Number",
    unknown: "Schema.Unknown",
    any: "Schema.Unknown",
    void: "Schema.Undefined",
    "string[]": "Schema.Array(Schema.String)",
    "readonly string[]": "Schema.Array(Schema.String)",
    "number[]": "Schema.Array(Schema.Number)",
    "readonly number[]": "Schema.Array(Schema.Number)",
    "boolean[]": "Schema.Array(Schema.Boolean)",
  }
  if (simple[text] !== undefined) return simple[text]
  if (isLiteral(text)) return literalsOf([text]) ?? "Schema.Unknown"
  // A function type is not data: `() => Element[]` is not an array of elements,
  // and a union with one member like it cannot be narrowed without rejecting
  // the callable.
  if (isFunctionType(text)) return "Schema.Unknown"

  // Unions come before the `[]` suffix: `number | number[]` is a union of a
  // number and an array, not an array. Splitting first is the only way to see
  // the `|` that separates them; `(a | b)[]` keeps one member here because the
  // separator is nested, and the `[]` suffix is handled below.
  const members = splitTopLevel(text, "|")
    .map((member) => member.trim())
    .filter((member) => member.length > 0)
  if (members.length > 1) return unionSchema(members)

  if (text.startsWith("readonly ")) return schemaOf(text.slice("readonly ".length))
  // A tuple before the `[]` suffix: `[string, string[]]` is a tuple whose last
  // element is an array, not an array of something.
  if (isTuple(text)) return tupleSchema(text)
  if (text.endsWith("[]")) return `Schema.Array(${schemaOf(text.slice(0, -2))})`

  if (text === "ISODate" || text === "ISOMonth") return "Schema.String"
  return "Schema.Unknown"
}

// `=>` outside quotes makes it a function type, which no Schema can narrow.
function isFunctionType(text) {
  let quoteChar
  for (let index = 0; index < text.length; index++) {
    const character = text[index]
    if (quoteChar !== undefined) {
      if (character === quoteChar && text[index - 1] !== "\\") quoteChar = undefined
      continue
    }
    if (character === '"' || character === "'") quoteChar = character
    else if (character === "=" && text[index + 1] === ">") return true
  }
  return false
}

// `(string | Element)[]` keeps its parentheses around the union, and
// `(a | b) | (c | d)` has parentheses that only cover part of the union. Only a
// pair that wraps the whole text is dropped, so a union is never corrupted.
function stripOuterParens(text) {
  let result = text
  while (result.startsWith("(") && result.endsWith(")")) {
    let depth = 0
    let quoteChar
    let wrapsAll = true
    for (let index = 0; index < result.length; index++) {
      const character = result[index]
      if (quoteChar !== undefined) {
        if (character === quoteChar && result[index - 1] !== "\\") quoteChar = undefined
        continue
      }
      if (character === '"' || character === "'") quoteChar = character
      else if (character === "(") depth++
      else if (character === ")") {
        depth--
        if (depth === 0 && index < result.length - 1) {
          wrapsAll = false
          break
        }
      }
    }
    if (!wrapsAll) return result
    result = result.slice(1, -1).trim()
  }
  return result
}

// Splits the nullish members off a union whatever else it holds, so
// `string | string[] | null` keeps both the array and the null.
function unionSchema(members) {
  const nullish = members.filter((member) => member === "null" || member === "undefined")
  const rest = members.filter((member) => member !== "null" && member !== "undefined")
  if (rest.length === 0) return "Schema.Unknown"
  const inner = rest.length === 1 ? schemaOf(rest[0]) : unionOfRest(rest)
  if (inner === "Schema.Unknown") return inner
  const hasNull = nullish.includes("null")
  const hasUndefined = nullish.includes("undefined")
  if (hasNull && hasUndefined) return `Schema.UndefinedOr(Schema.NullOr(${inner}))`
  if (hasNull) return `Schema.NullOr(${inner})`
  if (hasUndefined) return `Schema.UndefinedOr(${inner})`
  return inner
}

// A union of the members that are not null or undefined. Literal members merge
// into one `Schema.Literals`, a `string` member collapses the union only when
// every other member is a string already, and anything else is converted on its
// own and unioned: `number | number[]` keeps both halves.
function unionOfRest(members) {
  if (members.includes("string")) {
    const others = members.filter((member) => member !== "string")
    const stringsOnly = others.every(
      (member) =>
        isStringLiteral(member) ||
        member === "string & {}" ||
        member === "ISODate" ||
        member === "ISOMonth"
    )
    if (stringsOnly) return "Schema.String"
  }

  const literals = members.filter(isLiteral)
  const literalSchema = literals.length > 0 ? literalsOf(literals) : undefined
  const schemas = []
  let placedLiterals = false
  for (const member of members) {
    if (isLiteral(member)) {
      if (placedLiterals) continue
      placedLiterals = true
      if (literalSchema !== undefined) schemas.push(literalSchema)
      continue
    }
    schemas.push(schemaOf(member))
  }
  if (schemas.length === 0) return "Schema.Unknown"
  // One member the manifest does not describe taints the whole union: a
  // `Schema.Union` would reject the values that member accepts.
  if (schemas.includes("Schema.Unknown")) return "Schema.Unknown"
  const unique = [...new Set(schemas)]
  return unique.length === 1 ? unique[0] : `Schema.Union([${unique.join(", ")}])`
}

function isTuple(text) {
  return text.startsWith("[") && text.endsWith("]")
}

// `[number, number]` is a fixed-length tuple, not an array of either element.
function tupleSchema(text) {
  const elements = splitTopLevel(text.slice(1, -1), ",")
    .map((element) => element.trim())
    .filter((element) => element.length > 0)
  if (elements.length === 0) return "Schema.Unknown"
  const schemas = elements.map(schemaOf)
  if (schemas.includes("Schema.Unknown")) return "Schema.Unknown"
  return `Schema.Tuple([${schemas.join(", ")}])`
}

// A literal union, as one `Schema.Literals` when the members share a type and
// a `Schema.Union` of `Schema.Literal`s when they don't.
function literalsOf(members) {
  if (members.length === 0) return undefined
  if (members.length === 1) return `Schema.Literal(${literal(members[0])})`
  const kinds = new Set(members.map(kindOf))
  if (kinds.has(undefined) || kinds.size > 1) {
    return `Schema.Union([${members.map((member) => `Schema.Literal(${literal(member)})`).join(", ")}])`
  }
  return `Schema.Literals([${members.map(literal).join(", ")}])`
}

function kindOf(member) {
  if (/^(true|false)$/.test(member)) return "boolean"
  if (/^-?\d+(\.\d+)?$/.test(member)) return "number"
  if (/^"[^"]*"$/.test(member) || /^'[^']*'$/.test(member)) return "string"
  return undefined
}

function splitTopLevel(text, separator) {
  const parts = []
  let depth = 0
  let start = 0
  let quoteChar
  for (let index = 0; index < text.length; index++) {
    const character = text[index]
    if (quoteChar !== undefined) {
      if (character === quoteChar && text[index - 1] !== "\\") quoteChar = undefined
      continue
    }
    if (character === '"' || character === "'") quoteChar = character
    else if ("<({[".includes(character)) depth++
    // `=>` closes nothing: counting its `>` as a bracket would send the rest
    // of the text below depth 0, where the separator stops matching and
    // `(date: string) => boolean | readonly DateMatcher[]` reads as one member.
    else if (character === ">" && text[index - 1] === "=") continue
    else if (">)}]".includes(character)) depth = Math.max(0, depth - 1)
    else if (character === separator && depth === 0) {
      parts.push(text.slice(start, index))
      start = index + 1
    }
  }
  parts.push(text.slice(start))
  return parts
}

function isLiteral(text) {
  return (
    /^"[^"]*"$/.test(text) ||
    /^'[^']*'$/.test(text) ||
    /^(true|false)$/.test(text) ||
    /^-?\d+(\.\d+)?$/.test(text)
  )
}

function isStringLiteral(text) {
  return /^"[^"]*"$/.test(text) || /^'[^']*'$/.test(text)
}

function literal(text) {
  return text.replace(/^'/, '"').replace(/'$/, '"')
}

// ---------------------------------------------------------------------------
// Event type text -> the Schema that decodes its detail
// ---------------------------------------------------------------------------

// A change event's detail is `{ value, reason, source }`, which is what a view
// reads. Richer details keep the fields that matter and drop the DOM event and
// the cancel callbacks, since a decoded payload cannot cancel anything.
function eventSchema(typeText) {
  const raw = String(typeText ?? "unknown").trim()
  const text = raw.replace(/\s+/g, " ")
  const change =
    /^Ui(?:Detailed)?ChangeEvent<([\s\S]+)>$/.exec(text) ??
    /^CustomEvent<UiChangeDetail<([\s\S]+)>>$/.exec(text)
  if (change) {
    const [valueType, detailsType] = splitTopLevel(change[1], ",").map((part) => part.trim())
    return changeSchema(schemaOf(valueType), extraDetailFields(detailsType))
  }
  if (text === "UiOpenChangeCompleteEvent") {
    return "Schema.Struct({ value: Schema.Boolean })"
  }
  // Every dismiss-attempt detail the manifest names carries a reason and
  // nothing a view can act on.
  if (/^UiDismissAttemptEvent</.test(text) || text === "CustomEvent<DialogDismissAttemptDetails>") {
    return "Schema.Struct({ reason: Schema.String })"
  }
  if (text === "UiHighlightEvent") {
    return "Schema.Struct({ value: Schema.Unknown, index: Schema.Number })"
  }
  if (text === "UiLoadMoreEvent") {
    return "Schema.Struct({})"
  }
  if (text === "CustomEvent<UiActionDetail>") {
    return "Schema.Struct({ source: Schema.String })"
  }
  const custom = /^CustomEvent<([\s\S]+)>$/.exec(raw)
  if (custom) {
    const inner = custom[1].trim()
    if (inner.startsWith("{")) return objectSchema(inner)
    return "Schema.Unknown"
  }
  return "Schema.Unknown"
}

function changeSchema(valueSchema, extraFields = []) {
  const fields = [
    `value: ${valueSchema}`,
    "reason: Schema.String",
    "source: Schema.String",
    ...extraFields,
  ]
  return `Schema.Struct({\n${fields.map((field) => `      ${field},`).join("\n")}\n    })`
}

// Inline `{ ... }` members intersected onto a change event's details (such as
// `ChangeDetails<...> & { trigger: string | null }`) keep their fields rather
// than letting `Schema.Struct` drop them as excess properties at decode time.
function extraDetailFields(detailsType) {
  if (detailsType === undefined) return []
  const fields = []
  for (const part of splitTopLevel(detailsType, "&").map((member) => member.trim())) {
    if (!part.startsWith("{")) continue
    fields.push(...objectFields(leadingObjectBody(part)))
  }
  return fields
}

// `{ value: string; index: number; event?: Event }` becomes a Struct of the
// fields it describes. A field the manifest types as a DOM event or a function
// is left out: it is not data a view can use.
//
// The manifest is not consistent about how it separates fields. Some details use
// `;`, some put one field per line with no separator at all, and some lose the
// newline entirely (`{ value: string waitUntil: ... }` for `ui-menu:action`).
// Fields are therefore read as runs of text between the starts of two field
// names, so a newline, a `;` and neither one all split the same way.
function objectFields(body) {
  const fields = []
  for (const part of objectFieldSlices(body)) {
    const field = /^\s*([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+?)\s*$/.exec(part)
    if (field === null) continue
    const [, name, optional, type] = field
    const schema = schemaOf(type)
    if (/\bEvent\b/.test(type) || type.includes("=>") || schema === "Schema.Undefined") continue
    fields.push(`${key(name)}: ${optional ? `Schema.optional(${schema})` : schema}`)
  }
  return fields
}

function objectSchema(text) {
  const body = leadingObjectBody(text)
  const fields = objectFields(body)
  if (fields.length > 0) return `Schema.Struct({ ${fields.join(", ")} })`
  // A body that carries fields but none a view can use is not an empty
  // detail: decoding it as one would reject every real event. `Schema.Unknown`
  // accepts it instead, and silently.
  return body.trim().length === 0 ? "Schema.Struct({})" : "Schema.Unknown"
}

// One slice per field: from the start of a top-level `name:` to the start of
// the next one, or to a top-level `;` or newline if that comes first. Colons
// inside brackets (`(promise: Promise<unknown>) => void`) or object types are
// nested, so they cannot start a field.
function objectFieldSlices(body) {
  const starts = []
  const separators = []
  let depth = 0
  let quoteChar
  for (let index = 0; index < body.length; index++) {
    const character = body[index]
    if (quoteChar !== undefined) {
      if (character === quoteChar && body[index - 1] !== "\\") quoteChar = undefined
      continue
    }
    if (character === '"' || character === "'") quoteChar = character
    else if ("(<[{".includes(character)) depth++
    else if (character === ">" && body[index - 1] === "=") continue
    else if (")>]}".includes(character)) depth = Math.max(0, depth - 1)
    else if (depth === 0 && (character === ";" || character === "\n")) separators.push(index)
    else if (
      depth === 0 &&
      (index === 0 || /[\s;,]/.test(body[index - 1])) &&
      /^([A-Za-z_$][\w$]*)(\?)?\s*:/.test(body.slice(index))
    ) {
      starts.push(index)
    }
  }
  return starts.map((start, position) => {
    const nextStart = position + 1 < starts.length ? starts[position + 1] : body.length
    const nextSeparator = separators.find((separator) => separator > start) ?? body.length
    return body.slice(start, Math.min(nextStart, nextSeparator))
  })
}

// The `{ ... }` block a detail type starts with, without whatever an
// intersection appends: `{ value: Event; } & Pick<UiActionDetail, ...>` keeps
// only the first block.
function leadingObjectBody(text) {
  const trimmed = text.trim()
  let depth = 0
  let quoteChar
  for (let index = 0; index < trimmed.length; index++) {
    const character = trimmed[index]
    if (quoteChar !== undefined) {
      if (character === quoteChar && trimmed[index - 1] !== "\\") quoteChar = undefined
      continue
    }
    if (character === '"' || character === "'") quoteChar = character
    else if ("{([<".includes(character)) depth++
    else if (character === ">" && trimmed[index - 1] === "=") continue
    else if ("})]>".includes(character)) {
      depth = Math.max(0, depth - 1)
      if (depth === 0) return trimmed.slice(1, index)
    }
  }
  return trimmed.replace(/^\{/, "").replace(/\}$/, "")
}

function summary(description) {
  const first = String(description ?? "")
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, " ")
    .trim()
  return first.length > 200 ? `${first.slice(0, 197)}...` : first
}

// ---------------------------------------------------------------------------
// Manifest -> entries
// ---------------------------------------------------------------------------

const modules = manifest.modules
  .filter((module) => (module.declarations ?? []).some((declaration) => declaration.tagName))
  .map((module) => ({
    entry: path.basename(module.path, ".js"),
    declarations: (module.declarations ?? [])
      .filter((declaration) => declaration.tagName)
      .sort((left, right) => left.tagName.localeCompare(right.tagName)),
  }))
  .sort((left, right) => left.entry.localeCompare(right.entry))

const output = new Map()
const bindings = []
const catalog = []

for (const { entry, declarations } of modules) {
  if (!webExports.has(`./${entry}`)) {
    throw new Error(
      `@ui-sdk/web ${webVersion} has a manifest entry "${entry}" but no "./${entry}" export, so the binding could not register its elements.`
    )
  }

  const names = new Set()
  const blocks = declarations.map((declaration) => {
    const name = exportName(declaration.tagName, entry)
    if (names.has(name)) {
      throw new Error(`${entry}: two tags export ${name}`)
    }
    names.add(name)
    bindings.push({ entry, name, tag: declaration.tagName, declaration })

    const properties = new Map()
    for (const member of declaration.members ?? []) {
      if (member.kind !== "field" || member.static || member.readonly) continue
      if (excludedProperties.has(member.name)) continue
      properties.set(member.name, schemaOf(member.type?.text))
    }

    const events = new Map()
    for (const event of declaration.events ?? []) {
      events.set(event.name, eventSchema(event.type?.text))
    }

    catalog.push({
      entry,
      namespace: pascal(entry),
      name,
      tag: declaration.tagName,
      properties: [...properties.keys()],
      events: [...events.keys()],
    })

    const propertyLines = [...properties].map(
      ([property, schema]) => `    ${key(property)}: ${schema},`
    )
    const eventLines = [...events].map(
      ([event, schema]) => `    ${quote(event)}: ${schema},`
    )

    return [
      "/**",
      ` * ${summary(declaration.description) || `\`<${declaration.tagName}>\`.`}`,
      ` * @see https://ui-sdk.dev/docs/web-components/components/${entry}`,
      " */",
      `export const ${name} = Html.customElement({`,
      `  tag: ${quote(declaration.tagName)},`,
      "  properties: {",
      ...propertyLines,
      "  },",
      "  events: {",
      ...eventLines,
      "  },",
      "})",
    ].join("\n")
  })

  output.set(
    path.join(entriesDir, `${entry}.ts`),
    [
      HEADER,
      `import "@ui-sdk/web/${entry}"`,
      'import { Html } from "@effect/ui/html"',
      'import { Schema } from "effect"',
      "",
      ...blocks.flatMap((block) => [block, ""]),
    ].join("\n")
  )
}

output.set(
  path.join(sourceDir, "index.ts"),
  [
    HEADER,
    "//",
    "// Importing this barrel registers every UI SDK element, because it imports",
    "// every entry. Import a component subpath (`@boozedog/effect-ui-sdk/toggle`)",
    "// to register only what a view renders and keep the rest out of the bundle.",
    ...modules.map(({ entry }) => `export * as ${pascal(entry)} from "./entries/${entry}"`),
    'export * from "./catalog"',
    "",
  ].join("\n")
)

// What a catalog or a manifest test needs to know about the bindings without
// reading the manifest again: the entry, the namespace member, and the property
// and event names each declares. Generated next to the entries so it cannot
// disagree with them.
output.set(
  path.join(sourceDir, "catalog.ts"),
  [
    HEADER,
    "//",
    "// One row per binding: which entry registers the tag, the namespace member",
    "// that holds it, and the names it declares. The catalog site and the",
    "// manifest test read this instead of the raw manifest.",
    `export const uiSdkVersion = ${quote(webVersion)}`,
    "",
    "export interface Binding {",
    "  readonly entry: string",
    "  readonly namespace: string",
    "  readonly name: string",
    "  readonly tag: string",
    "  readonly properties: ReadonlyArray<string>",
    "  readonly events: ReadonlyArray<string>",
    "}",
    "",
    "export const bindings: ReadonlyArray<Binding> = [",
    ...catalog.map(
      ({ entry, namespace, name, tag, properties, events }) =>
        `  { entry: ${quote(entry)}, namespace: ${quote(namespace)}, name: ${quote(name)}, tag: ${quote(tag)}, properties: [${properties.map(quote).join(", ")}], events: [${events.map(quote).join(", ")}] },`
    ),
    "]",
    "",
    "export interface Entry {",
    "  readonly entry: string",
    "  readonly namespace: string",
    "  readonly tags: ReadonlyArray<Binding>",
    "}",
    "",
    "/** The entries, each with the bindings it holds, in manifest order. */",
    "export const entries: ReadonlyArray<Entry> = [",
    ...modules.map(
      ({ entry }) =>
        `  { entry: ${quote(entry)}, namespace: ${quote(pascal(entry))}, tags: bindings.filter((binding) => binding.entry === ${quote(entry)}) },`
    ),
    "]",
    "",
    "export const bindingOf = (tag: string): Binding | undefined =>",
    "  bindings.find((binding) => binding.tag === tag)",
    "",
  ].join("\n")
)

// ---------------------------------------------------------------------------
// Write or check
// ---------------------------------------------------------------------------

const stale = []
for (const [file, content] of output) {
  const current = existsSync(file) ? readFileSync(file, "utf8") : undefined
  if (current === content) continue
  stale.push(path.relative(packageDir, file))
  if (!check) {
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, content)
  }
}

// An entry that the manifest no longer has would otherwise keep exporting
// bindings for elements that no longer exist.
if (existsSync(entriesDir)) {
  for (const file of readdirSync(entriesDir)) {
    if (!file.endsWith(".ts")) continue
    const target = path.join(entriesDir, file)
    if (output.has(target)) continue
    stale.push(path.relative(packageDir, target))
    if (!check) rmSync(target)
  }
}

if (check) {
  if (stale.length > 0) {
    console.error(
      `Generated bindings are stale (${stale.length} file${stale.length === 1 ? "" : "s"}):\n  ${stale.join("\n  ")}\nRun \`pnpm generate\`.`
    )
    process.exitCode = 1
  } else {
    console.log(
      `Generated bindings are current (${bindings.length} tags across ${modules.length} entries, UI SDK ${webVersion}).`
    )
  }
} else {
  console.log(
    `Generated ${bindings.length} bindings across ${modules.length} entries from UI SDK ${webVersion}.`
  )
}
