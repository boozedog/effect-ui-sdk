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
  const text = String(typeText ?? "unknown").trim().replace(/\s+/g, " ")
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

  if (text.startsWith("readonly ")) return schemaOf(text.slice("readonly ".length))
  if (text.startsWith("(") && text.endsWith(")")) return schemaOf(text.slice(1, -1))
  if (text.endsWith("[]")) return `Schema.Array(${schemaOf(text.slice(0, -2))})`

  const members = splitTopLevel(text, "|").map((member) => member.trim())
  if (members.length > 1) {
    const nullish = members.filter((member) => member === "null" || member === "undefined")
    const rest = members.filter((member) => member !== "null" && member !== "undefined")
    if (nullish.length > 0 && rest.length === 1) {
      const inner = schemaOf(rest[0])
      if (inner === "Schema.Unknown") return inner
      if (nullish.includes("null") && nullish.includes("undefined")) {
        return `Schema.UndefinedOr(Schema.NullOr(${inner}))`
      }
      return nullish.includes("null") ? `Schema.NullOr(${inner})` : `Schema.UndefinedOr(${inner})`
    }
    // `string | "top" | "bottom"` and `string & {}` shapes: a general string
    // covers every member the manifest names.
    if (rest.includes("string")) return "Schema.String"
    if (rest.includes("boolean")) {
      const others = rest.filter((member) => member !== "boolean" && isLiteral(member))
      if (others.length === rest.length - 1) {
        const literals = literalsOf(others)
        return literals === undefined
          ? "Schema.Unknown"
          : `Schema.Union([Schema.Boolean, ${literals}])`
      }
      return "Schema.Unknown"
    }
    if (rest.every((member) => isLiteral(member))) {
      const literals = literalsOf(rest)
      return literals ?? "Schema.Unknown"
    }
    return "Schema.Unknown"
  }

  if (isLiteral(text)) return literalsOf([text]) ?? "Schema.Unknown"
  // Branded ISO date strings are strings at runtime.
  if (text === "ISODate" || text === "ISOMonth") return "Schema.String"
  return "Schema.Unknown"
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
    else if (">)}]".includes(character)) depth--
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
  const text = String(typeText ?? "unknown").trim().replace(/\s+/g, " ")
  const change =
    /^Ui(?:Detailed)?ChangeEvent<([\s\S]+)>$/.exec(text) ??
    /^CustomEvent<UiChangeDetail<([\s\S]+)>>$/.exec(text)
  if (change) {
    const [valueType] = splitTopLevel(change[1], ",").map((part) => part.trim())
    return changeSchema(schemaOf(valueType))
  }
  if (text === "UiOpenChangeCompleteEvent") {
    return "Schema.Struct({ value: Schema.Boolean })"
  }
  if (/^UiDismissAttemptEvent</.test(text)) {
    return "Schema.Struct({ reason: Schema.String })"
  }
  if (text === "UiHighlightEvent") {
    return "Schema.Struct({ value: Schema.Unknown })"
  }
  if (text === "UiLoadMoreEvent") {
    return "Schema.Struct({})"
  }
  if (text === "CustomEvent<UiActionDetail>") {
    return "Schema.Struct({ source: Schema.String })"
  }
  const custom = /^CustomEvent<([\s\S]+)>$/.exec(text)
  if (custom) {
    const inner = custom[1].trim()
    if (inner.startsWith("{")) return objectSchema(inner)
    return "Schema.Unknown"
  }
  return "Schema.Unknown"
}

function changeSchema(valueSchema) {
  return `Schema.Struct({
      value: ${valueSchema},
      reason: Schema.String,
      source: Schema.String,
    })`
}

// `{ value: string; index: number; event?: Event }` becomes a Struct of the
// fields it describes. A field the manifest types as a DOM event or a function
// is left out: it is not data a view can use.
function objectSchema(text) {
  const body = text.replace(/^\{/, "").replace(/\}$/, "")
  const fields = []
  for (const part of splitTopLevel(body, ";")) {
    const field = /^([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+)$/.exec(part.trim())
    if (field === null) continue
    const [, name, optional, type] = field
    const schema = schemaOf(type)
    if (/\bEvent\b/.test(type) || schema === "Schema.Undefined") continue
    fields.push(`${key(name)}: ${optional ? `Schema.optional(${schema})` : schema}`)
  }
  return fields.length > 0 ? `Schema.Struct({ ${fields.join(", ")} })` : "Schema.Struct({})"
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
