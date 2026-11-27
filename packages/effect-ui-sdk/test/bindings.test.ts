// Every assertion here compares the generated bindings with the manifest
// `@ui-sdk/web` actually ships, so a stale `pnpm generate` fails the suite
// instead of shipping a binding for a property that no longer exists.
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { Component, Mount, View } from "@effect/ui"
// Used by the typecheck test below, which reads `HTMLElementTagNameMap`.
import { Html } from "@effect/ui/html"
import type { UiDialogElement, UiToggleElement } from "@ui-sdk/web"
import { Effect, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { bindings, bindingOf, entries, uiSdkVersion, type Binding } from "../src/catalog"
import * as Dialog from "../src/entries/dialog"
import * as Toggle from "../src/entries/toggle"
import { createHistory, describeEntry, stageChanges } from "../src/history"
import * as All from "../src/index"

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

    const extraDetailFields: Record<string, Record<string, unknown>> = {
      "ui-trigger-menu": { trigger: "@" },
    }

    for (const { row, event } of changeEvents) {
      const schema = specOf(row).events[event]
      expect(schema, `${row.tag} ${event}`).toBeDefined()
      const extra = extraDetailFields[row.tag] ?? {}
      const decoded = candidates.some(
        (value) =>
          Schema.decodeUnknownExit(schema!)({
            value,
            reason: "press",
            source: "mouse",
            ...extra,
          })._tag === "Success"
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

// The schemas the generator derives are the point of the package: a view writes
// a property and reads a detail, and a Schema that is too narrow rejects the
// values the element actually sends. These read the generated Schemas, not the
// manifest, so a regression in `scripts/generate.mjs` fails here.
describe("schema narrowing", () => {
  const decode = (schema: Schema.Top, value: unknown) =>
    Schema.decodeUnknownExit(schema as Schema.Decoder<unknown>)(value)

  const accepts = (schema: Schema.Top, ...values: ReadonlyArray<unknown>) => {
    for (const value of values) {
      expect(decode(schema, value)._tag, `${JSON.stringify(value)} should decode`).toBe("Success")
    }
  }

  const rejects = (schema: Schema.Top, ...values: ReadonlyArray<unknown>) => {
    for (const value of values) {
      expect(decode(schema, value)._tag, `${JSON.stringify(value)} should not decode`).toBe("Failure")
    }
  }

  const property = (tag: string, name: string): Schema.Top => {
    const schema = specOf(binding(tag)).properties[name]
    if (schema === undefined) throw new Error(`${tag} has no property ${name}`)
    return schema
  }

  const event = (tag: string, name: string): Schema.Decoder<unknown> => {
    const schema = specOf(binding(tag)).events[name]
    if (schema === undefined) throw new Error(`${tag} has no event ${name}`)
    return schema
  }

  // A change detail carries where the change came from beside the value.
  const change = (value: unknown) => ({ value, reason: "press", source: "keyboard" })

  const acceptsChange = (schema: Schema.Top, ...values: ReadonlyArray<unknown>) =>
    accepts(schema, ...values.map(change))

  it("keeps both halves of `number | number[]`", () => {
    const value = property("ui-slider", "value")
    accepts(value, 40, [40, 60])
    rejects(value, "40", [40, "60"])

    const valuechange = event("ui-slider", "valuechange")
    acceptsChange(valuechange, 40, [40, 60])
    rejects(valuechange, change("40"), change([40, "60"]))
  })

  it("keeps the array and the null of `string | string[] | null`", () => {
    const value = property("ui-tree", "value")
    accepts(value, "a", ["a", "b"], null)
    rejects(value, 1, [1])

    const valuechange = event("ui-tree", "valuechange")
    acceptsChange(valuechange, "a", ["a", "b"], null)
    rejects(valuechange, change(1))
  })

  it("reads calendar and date-picker values as strings, tuples and null", () => {
    const calendar = property("ui-calendar", "value")
    accepts(calendar, "2024-01-05", ["2024-01-05"], ["2024-01-05", "2024-01-09"], null)
    rejects(calendar, 20240105, ["2024-01-05", 20240109])

    const datePicker = property("ui-date-picker", "value")
    accepts(datePicker, "2024-01-05", ["2024-01-05", "2024-01-09"], null)
    rejects(datePicker, 20240105)
  })

  it("leaves a matcher union that names callbacks as Schema.Unknown", () => {
    // `string | { from, to } | ... | (date) => boolean | readonly DateMatcher[]`
    // has a function member, so no narrower Schema can accept all of it.
    const unavailable = property("ui-calendar", "unavailable")
    accepts(
      unavailable,
      "2024-01-05",
      ["2024-01-05"],
      { from: "2024-01-05", to: "2024-01-09" },
      { weekday: [0, 6] },
      [{ before: "2024-01-05" }],
      (date: string) => date.length > 0
    )
  })

  it("keeps both halves of a string-or-array property", () => {
    accepts(property("ui-file-input", "accept"), "image/*", ["image/png", "image/jpeg"])
    rejects(property("ui-file-input", "accept"), 42)
  })

  it("accepts the objects and nulls an anchor or paste target can be", () => {
    for (const [tag, name] of [
      ["ui-file-input-dropzone", "pasteTarget"],
      ["ui-combobox-content", "anchor"],
    ] as const) {
      const schema = property(tag, name)
      accepts(schema, {}, null, { x: 1, y: 2 }, ["a"])
    }
  })

  it("accepts a function for persistentElements", () => {
    accepts(property("ui-dialog", "persistentElements"), () => [])
  })

  it("decodes a dismiss attempt to its reason", () => {
    const schema = event("ui-dialog", "dismissattempt")
    expect(decode(schema, { reason: "escape-key" })._tag).toBe("Success")
    expect(Schema.decodeUnknownSync(schema)({ reason: "escape-key" })).toEqual({ reason: "escape-key" })
    rejects(schema, {}, { reason: 1 })
  })

  it("keeps `index` on UiHighlightEvent details", () => {
    for (const tag of ["ui-autocomplete", "ui-combobox", "ui-listbox", "ui-select"]) {
      const schema = event(tag, "highlight")
      expect(Schema.decodeUnknownSync(schema)({ value: "alpha", index: 2 })).toEqual({
        value: "alpha",
        index: 2,
      })
      rejects(schema, { value: "alpha" }, { value: "alpha", index: "2" })
    }
  })

  it("keeps intersected fields on trigger-menu change events", () => {
    const openchange = event("ui-trigger-menu", "openchange")
    expect(
      Schema.decodeUnknownSync(openchange)({
        value: true,
        reason: "trigger",
        source: "keyboard",
        trigger: "@",
      })
    ).toEqual({
      value: true,
      reason: "trigger",
      source: "keyboard",
      trigger: "@",
    })
    rejects(openchange, { value: true, reason: "trigger", source: "keyboard" })

    const querychange = event("ui-trigger-menu", "querychange")
    expect(
      Schema.decodeUnknownSync(querychange)({
        value: "al",
        reason: "input",
        source: "keyboard",
        trigger: "@",
        argument: "al",
      })
    ).toEqual({
      value: "al",
      reason: "input",
      source: "keyboard",
      trigger: "@",
      argument: "al",
    })
    expect(
      Schema.decodeUnknownSync(querychange)({
        value: "",
        reason: "input",
        source: "keyboard",
        trigger: "@",
      })
    ).toEqual({
      value: "",
      reason: "input",
      source: "keyboard",
      trigger: "@",
    })
  })

  it("decodes an action to its value, with no empty detail", () => {
    for (const tag of ["ui-menu", "ui-command", "ui-tree"]) {
      const schema = event(tag, "action")
      expect(decode(schema, { value: "rename" })._tag, tag).toBe("Success")
      expect(Schema.decodeUnknownSync(schema)({ value: "rename" })).toEqual({ value: "rename" })
      rejects(schema, {})
    }
  })

  it("keeps `number | \"auto\"`", () => {
    const schema = property("ui-carousel", "slidesPerPage")
    accepts(schema, 3, "auto")
    rejects(schema, "three", true)
  })

  it("reads a waterfall range as a tuple", () => {
    accepts(property("ui-waterfall", "range"), [0, 100])
    rejects(property("ui-waterfall", "range"), [0], [0, 100, 200], 100)
  })
})

// `@effect/ui` reads `HTMLElementTagNameMap`, which `@ui-sdk/web` augments, to
// type a custom element's `ref` and `onMount`. These lines are checked by
// `tsc --noEmit`; the runtime only proves the values exist.
describe("element types", () => {
  const ToggleNode = Mount.make("ToggleNode", {}, (element: UiToggleElement) =>
    Effect.as(Effect.succeed(void element), Component.noop)
  )
  const DialogNode = Mount.make("DialogNode", {}, (element: UiDialogElement) =>
    Effect.as(Effect.succeed(void element), Component.noop)
  )

  const typed = (h: Html.H<never>) => ({
    toggleRef: Toggle.Root(h).ref(Html.ref("toggle", "ui-toggle")),
    dialogRef: Dialog.Root(h).ref(Html.ref("dialog", "ui-dialog")),
    toggleMount: Toggle.Root(h).onMount(ToggleNode({})),
    dialogMount: Dialog.Root(h).onMount(DialogNode({})),
    // A ref or a mount of another element doesn't fit: `Renderer.Ref` and the
    // mount's node are both typed by `HTMLElementTagNameMap["ui-toggle"]`.
    // @ts-expect-error a dialog ref does not fit a toggle
    wrongRef: Toggle.Root(h).ref(Html.ref("dialog", "ui-dialog")),
    // @ts-expect-error a dialog node does not fit a toggle
    wrongMount: Toggle.Root(h).onMount(DialogNode({})),
    // @ts-expect-error a custom element ref does not fit a plain div
    wrongPlain: h.div.ref(Html.ref("toggle", "ui-toggle")),
  })

  it("infers each element from HTMLElementTagNameMap", () => {
    expect(typeof typed).toBe("function")
  })

  it("re-exports UI SDK's history helpers", () => {
    expect(typeof createHistory).toBe("function")
    expect(typeof describeEntry).toBe("function")
    expect(typeof stageChanges).toBe("function")
    expect(
      describeEntry({
        id: "1",
        ref: "c1",
        label: "Pinned",
        key: "pressed",
        value: true,
        previous: false,
        source: "pointer",
        reason: "press",
      })
    ).toBe("You set Pinned to true")
  })
})
