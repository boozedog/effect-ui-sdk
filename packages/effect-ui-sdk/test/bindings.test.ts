// Every assertion here compares the generated bindings with the manifest
// `@ui-sdk/web` actually ships, so a stale `pnpm generate` fails the suite
// instead of shipping a binding for a property that no longer exists.
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { Html } from "@effect/ui/html"
import { View } from "@effect/ui"
import { Schema } from "effect"
import { describe, expect, it } from "vitest"
import * as All from "../src/index"
import { bindings, bindingOf, entries, uiSdkVersion, type Binding } from "../src/catalog"

const require = createRequire(import.meta.url)
const webDir = path.dirname(require.resolve("@ui-sdk/web/package.json"))
const manifest = JSON.parse(readFileSync(path.join(webDir, "custom-elements.json"), "utf8"))
const webPackage = JSON.parse(readFileSync(path.join(webDir, "package.json"), "utf8"))

interface ManifestMember {
  readonly kind: string
  readonly name: string
  readonly readonly?: boolean
  readonly static?: boolean
}

interface ManifestDeclaration {
  readonly tagName?: string
  readonly customElement?: boolean
  readonly members?: ReadonlyArray<ManifestMember>
  readonly events?: ReadonlyArray<{ readonly name: string }>
}

interface ManifestModule {
  readonly path: string
  readonly declarations?: ReadonlyArray<ManifestDeclaration>
}

const manifestTags = new Map<string, { entry: string; declaration: ManifestDeclaration }>()
for (const module of manifest.modules as ReadonlyArray<ManifestModule>) {
  const entry = module.path.replace(/^dist\/entries\//, "").replace(/\.js$/, "")
  for (const declaration of module.declarations ?? []) {
    if (declaration.tagName === undefined) continue
    manifestTags.set(declaration.tagName, { entry, declaration })
  }
}

// The handles the element owns for itself: a view writing one would fight the
// controller inside it, so the generator leaves them out of `properties`.
const excludedProperties = new Set(["api", "controller"])

const manifestProperties = (declaration: ManifestDeclaration): ReadonlyArray<string> =>
  (declaration.members ?? [])
    .filter(
      (member) =>
        member.kind === "field" &&
        member.static !== true &&
        member.readonly !== true &&
        !excludedProperties.has(member.name)
    )
    .map((member) => member.name)

const manifestEvents = (declaration: ManifestDeclaration): ReadonlyArray<string> =>
  (declaration.events ?? []).map((event) => event.name)

const namespaces = All as unknown as Record<string, Record<string, unknown> | undefined>

// What `Html.customElement` returns, as a view sees it: a callable that also
// carries the tag, the property Schemas and the event Schemas.
interface Spec {
  readonly tag: string
  readonly properties: Record<string, Schema.Top>
  readonly events: Record<string, Schema.Decoder<unknown>>
}

const specOf = (row: Binding): Spec => {
  const spec = namespaces[row.namespace]?.[row.name] as Spec | undefined
  if (spec === undefined) throw new Error(`no binding exported as ${row.namespace}.${row.name}`)
  return spec
}

// The names `Html.customElement` never gives a generated method, read off the
// builder itself rather than a copy of the list that could drift. They are set
// with `.prop(name, value)` instead.
const reservedNames = (() => {
  const names = new Set<string>(Object.getOwnPropertyNames(Object.prototype))
  for (
    let object: object | null = new View.ContainerBuilder("");
    object !== null && object !== Object.prototype;
    object = Object.getPrototypeOf(object)
  ) {
    for (const name of Object.getOwnPropertyNames(object)) names.add(name)
  }
  for (const name of ["id", "class", "style"]) names.add(name)
  return names
})()

const binding = (tag: string): Binding => {
  const found = bindingOf(tag)
  if (found === undefined) throw new Error(`no binding for ${tag}`)
  return found
}

describe("the catalog against the manifest", () => {
  it("was generated from the installed UI SDK", () => {
    expect(uiSdkVersion).toBe(webPackage.version)
  })

  it("has a binding for every manifest tag, and none for anything else", () => {
    expect(bindings.map((row) => row.tag).sort()).toEqual([...manifestTags.keys()].sort())
    expect(bindings).toHaveLength(manifestTags.size)
  })

  it("puts every tag in the entry that registers it", () => {
    for (const [tag, { entry }] of manifestTags) {
      expect(binding(tag).entry, tag).toBe(entry)
    }
  })

  it("groups the bindings by entry the way the barrel namespaces do", () => {
    expect(entries.map((group) => group.namespace).sort()).toEqual(
      Object.keys(namespaces)
        .filter((name) => name !== "bindings" && name !== "entries" && name !== "bindingOf" && name !== "uiSdkVersion")
        .sort()
    )
    for (const group of entries) {
      expect(group.tags.map((row) => row.tag).sort(), group.entry).toEqual(
        bindings.filter((row) => row.entry === group.entry).map((row) => row.tag).sort()
      )
    }
  })

  it("names every entry after a real @ui-sdk/web export", () => {
    for (const { entry } of entries) {
      expect(Object.keys(webPackage.exports), entry).toContain(`./${entry}`)
    }
  })
})

describe("generated bindings", () => {
  it("declares exactly the manifest's properties and events", () => {
    for (const [tag, { declaration }] of manifestTags) {
      const row = binding(tag)
      expect(row.properties, `${tag} properties`).toEqual(manifestProperties(declaration))
      expect(row.events, `${tag} events`).toEqual(manifestEvents(declaration))
    }
  })

  it("matches the Schemas the entries actually export", () => {
    for (const row of bindings) {
      const spec = specOf(row)
      expect(spec.tag, `${row.namespace}.${row.name}`).toBe(row.tag)
      expect(Object.keys(spec.properties), `${row.tag} properties`).toEqual(row.properties)
      expect(Object.keys(spec.events), `${row.tag} events`).toEqual(row.events)
    }
  })

  it("binds no handle the element owns for itself", () => {
    for (const row of bindings) {
      expect(row.properties, row.tag).not.toContain("api")
      expect(row.properties, row.tag).not.toContain("controller")
    }
  })
})

describe("change events", () => {
  const candidates = [true, "value", 0, [], null, undefined]

  it("decode { value, reason, source } for every change event", () => {
    const changeEvents = bindings.flatMap((row) =>
      row.events
        .filter((event) => /change$|commit$/.test(event))
        .map((event) => ({ row, event }))
    )
    expect(changeEvents.length).toBeGreaterThan(50)

    for (const { row, event } of changeEvents) {
      const schema = specOf(row).events[event]
      expect(schema, `${row.tag} ${event}`).toBeDefined()
      const decoded = candidates.some(
        (value) =>
          Schema.decodeUnknownExit(schema!)({ value, reason: "press", source: "mouse" })._tag ===
          "Success"
      )
      expect(decoded, `${row.tag} "${event}" decodes a change detail`).toBe(true)
    }
  })

  it("reject a detail missing the change fields", () => {
    const schema = specOf(binding("ui-toggle")).events["pressedchange"]!
    expect(Schema.decodeUnknownExit(schema)({ pressed: true })._tag).toBe("Failure")
    expect(Schema.decodeUnknownExit(schema)(undefined)._tag).toBe("Failure")
  })
})

describe("builder methods", () => {
  // The binding is `(h) => root`: it ignores the helper and returns the
  // element's builder, which is where the generated methods live.
  const chainOf = (spec: Spec) => (spec as unknown as (h: never) => object)(undefined as never)

  // `Html.customElement` defines one own method per non-reserved property on
  // the builder class it creates, which is the chain's prototype. Checking
  // there is exact: it shows which methods were generated, not which happen to
  // resolve.
  const generatedMethods = (spec: Spec): ReadonlySet<string> =>
    new Set(Object.getOwnPropertyNames(Object.getPrototypeOf(chainOf(spec))))

  it("gives every property a method, except the builder's own names", () => {
    for (const row of bindings) {
      const generated = generatedMethods(specOf(row))
      for (const property of row.properties) {
        expect(generated.has(property), `${row.tag}.${property}`).toBe(!reservedNames.has(property))
      }
    }
  })

  it("reserves only the names the builder already uses", () => {
    const shadowed = bindings.flatMap((row) =>
      row.properties
        .filter((property) => reservedNames.has(property))
        .map((property) => `${row.tag}.${property}`)
    )
    // UI SDK declares `id` on `<ui-resizable-panel>`. The builder keeps its own
    // `id` and the property is declared, so `.prop("id", value)` is typed.
    expect(shadowed).toEqual(["ui-resizable-panel.id"])
    expect(specOf(binding("ui-resizable-panel")).properties).toHaveProperty("id")
  })

  it("reserves only the names the framework's builder already uses", () => {
    const shadowed = bindings.flatMap((row) =>
      row.properties
        .filter((property) => reservedNames.has(property))
        .map((property) => `${row.tag}.${property}`)
    )
    // UI SDK declares `id` on `<ui-resizable-panel>`, which the builder uses for
    // the element's own id. It is set with `.prop("id", value)`, still typed.
    expect(shadowed).toEqual(["ui-resizable-panel.id"])
  })

  it("keeps `.prop` typed for the names that get no method", () => {
    const panel = specOf(binding("ui-resizable-panel"))
    const chain = (panel as unknown as (h: never) => { prop: (name: string, value: unknown) => unknown })(
      undefined as never
    )
    expect(typeof chain.prop).toBe("function")
  })
})

describe("registration", () => {
  it("imports the matching @ui-sdk/web entry, which is what registers the tags", () => {
    // Registration is a side effect of the UISDK import, not of calling
    // `Html.customElement`. Each generated entry starts with it, so importing
    // `@boozedog/effect-ui-sdk/toggle` registers `ui-toggle` and nothing else.
    for (const { entry } of entries) {
      const source = readFileSync(path.join(import.meta.dirname, `../src/entries/${entry}.ts`), "utf8")
      expect(source.split("\n")[2], entry).toBe(`import "@ui-sdk/web/${entry}"`)
    }
  })

  it("declares those entries as side effects, so a bundler keeps them", () => {
    const pkg = JSON.parse(readFileSync(path.join(import.meta.dirname, "../package.json"), "utf8"))
    expect(pkg.sideEffects).toContain("./src/entries/*.ts")
  })

  it("registers nothing in a process without a DOM", () => {
    // Importing the barrel is safe on a server: `@ui-sdk/web`'s entries detect
    // the missing registry and do nothing.
    expect(typeof (globalThis as { customElements?: unknown }).customElements).toBe("undefined")
    expect(bindings.length).toBeGreaterThan(300)
  })
})
