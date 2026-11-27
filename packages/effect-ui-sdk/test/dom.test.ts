// @vitest-environment jsdom
// Round-trips through a real DOM: `BrowserHost.mount` renders the generated
// bindings, the browser upgrades the tags UI SDK registers, a property write
// reaches the element, and a user event comes back as the Model.
import { UiSchema } from "@effect/ui"
import { BrowserHost, Html } from "@effect/ui/html"
import { toggle } from "@ui-sdk/core/toggle"
import { Effect, Schema } from "effect"
import type { Scope } from "effect/Scope"
import { describe, expect, it } from "vitest"
import { createAgent } from "../src/agent"
import { createHistory, describeEntry } from "../src/history"
import { mount, settle } from "../src/testing"
import * as Menu from "../src/entries/menu"
import * as Slider from "../src/entries/slider"
import * as Toggle from "../src/entries/toggle"

// jsdom leaves out a few browser APIs UI SDK's elements call. `mount` from
// `@ui-sdk/core/testing` fills the same gaps for its own markup, so these are
// the browser's behaviour, not the binding's: a scroller, Web Animations and
// the form methods on `ElementInternals`.
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.getAnimations ??= () => []
const internals = (globalThis as { ElementInternals?: { prototype: object } }).ElementInternals?.prototype
if (internals !== undefined) {
  for (const name of ["setFormValue", "setValidity", "checkValidity", "reportValidity"]) {
    if (name in internals) continue
    Object.defineProperty(internals, name, { value: () => {}, configurable: true, writable: true })
  }
}

// The bindings write properties, not attributes, so reading the element's own
// field is what proves the write landed.
type ToggleElement = HTMLElement & { readonly pressed: boolean }
type SliderElement = HTMLElement & { readonly value: number | ReadonlyArray<number> }
type MenuElement = HTMLElement & { readonly open: boolean }

// A few microtask/timer turns: the host flushes on a microtask and UI SDK
// settles presence and focus on a frame after that.
const settleDom = Effect.sleep(20)

// Mounts for one test. The tree lives until this Effect ends: `Effect.scoped`
// closes the mount's Scope, and with it the tree, so every read happens
// inside the generator.
const mounted = (body: Effect.Effect<void, never, Scope>): Promise<void> =>
  Effect.runPromise(
    Effect.scoped(body).pipe(Effect.provide(BrowserHost.layer({ document })))
  )

const freshContainer = (): HTMLElement => {
  const container = document.createElement("div")
  document.body.append(container)
  return container
}

// Modals and menus portal beside the mount, so a test clears the page between
// cases rather than only the container.
const clearPage = () => document.body.replaceChildren()

const ToggleMessage = UiSchema.TaggedEnum({
  ChangedPressed: { pressed: Schema.Boolean },
})

const ToggleApp = Html.component({
  name: "DomToggle",
  model: Schema.Boolean,
  message: ToggleMessage,
}).make({
  // Starts pressed so the first render proves the Model's value is written.
  init: () => true,
  update: { ChangedPressed: (_$, { pressed }) => pressed },
  view: (h, pressed) =>
    Toggle.Root(h)
      .pressed(pressed)
      .on("pressedchange", ({ value }) => ToggleMessage.ChangedPressed({ pressed: value }))
      .children(h.button.attr("type", "button").children(pressed ? "Pinned" : "Pin")),
})

describe("<ui-toggle> through the bindings", () => {
  it("upgrades, writes the controlled property and reports the press", async () => {
    const container = freshContainer()
    try {
      await mounted(
        Effect.gen(function* () {
          const root = yield* BrowserHost.mountEffect(ToggleApp, {}, container)
          yield* settleDom
          const element = container.querySelector("ui-toggle") as ToggleElement
          const button = container.querySelector("button")!
          expect(customElements.get("ui-toggle")).toBeDefined()
          expect(element).toBeInstanceOf(customElements.get("ui-toggle")!)

          // `pressed` is a JavaScript property: the Model's `true` arrives
          // without an attribute, and UI SDK reflects its own state.
          expect(element.pressed).toBe(true)
          expect(element.hasAttribute("pressed")).toBe(false)
          expect(button.getAttribute("aria-pressed")).toBe("true")
          expect(button.textContent).toBe("Pinned")

          // The press is the user's: UI SDK changes the element, then the
          // event comes back and the Model follows.
          button.click()
          yield* settleDom

          expect(element.pressed).toBe(false)
          expect(root.model()).toBe(false)
          expect(button.getAttribute("aria-pressed")).toBe("false")
          expect(button.textContent).toBe("Pin")
        })
      )
    } finally {
      clearPage()
    }
  })
})

const SliderMessage = UiSchema.TaggedEnum({
  ChangedValue: { value: Schema.Union([Schema.Number, Schema.Array(Schema.Number)]) },
})

const SliderApp = Html.component({
  name: "DomSlider",
  model: Schema.Array(Schema.Number),
  message: SliderMessage,
}).make({
  init: () => [40],
  update: {
    ChangedValue: (_$, { value }) => (typeof value === "number" ? [value] : value),
  },
  view: (h, value) =>
    Slider.Root(h)
      .value(value)
      .min(0)
      .max(100)
      .step(1)
      .on("valuechange", ({ value }) => SliderMessage.ChangedValue({ value }))
      .children(
        Slider.Control(h).children(
          Slider.Track(h).children(
            Slider.Indicator(h),
            Slider.Thumb(h).attr("aria-label", "Volume")
          )
        )
      ),
})

describe("<ui-slider> through the bindings", () => {
  it("upgrades, writes the array value and reports a move", async () => {
    const container = freshContainer()
    try {
      await mounted(
        Effect.gen(function* () {
          const root = yield* BrowserHost.mountEffect(SliderApp, {}, container)
          yield* settleDom
          const element = container.querySelector("ui-slider") as SliderElement
          const input = container.querySelector("input[type='range']") as HTMLInputElement
          expect(element).toBeInstanceOf(customElements.get("ui-slider")!)

          // The Model's array is the element's `value`, and the thumb's range
          // input shows the number it holds.
          expect(element.value).toEqual([40])
          expect(input.value).toBe("40")
          expect(input.getAttribute("aria-label")).toBe("Volume")

          // Moving the thumb is a user input event the element turns into
          // `valuechange`; the binding decodes it and the Model follows.
          input.value = "70"
          input.dispatchEvent(new Event("input", { bubbles: true }))
          yield* settleDom

          expect(root.model()).toEqual([70])
          expect(element.value).toEqual([70])
          expect(input.value).toBe("70")
          expect(input.getAttribute("aria-valuetext")).toBe("70")
        })
      )
    } finally {
      clearPage()
    }
  })
})

const MenuMessage = UiSchema.TaggedEnum({
  ChangedOpen: { open: Schema.Boolean },
  RanAction: { value: Schema.String },
})

const MenuModel = Schema.Struct({ open: Schema.Boolean, ran: Schema.String })

const MenuApp = Html.component({
  name: "DomMenu",
  model: MenuModel,
  message: MenuMessage,
}).make({
  init: () => ({ open: false, ran: "" }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    RanAction: ($, { value }) => $.evolve({ ran: value }),
  },
  view: (h, model) =>
    Menu.Root(h)
      .open(model.open)
      .on("openchange", ({ value }) => MenuMessage.ChangedOpen({ open: value }))
      .on("action", ({ value }) => MenuMessage.RanAction({ value }))
      .children(
        Menu.Trigger(h).children(h.button.attr("type", "button").children("Open")),
        Menu.Content(h).children(
          Menu.Item(h).value("rename").children("Rename"),
          Menu.Item(h).value("delete").children("Delete")
        )
      ),
})

describe("<ui-menu> through the bindings", () => {
  it("upgrades, opens on the trigger and decodes the action's value", async () => {
    const container = freshContainer()
    try {
      await mounted(
        Effect.gen(function* () {
          const root = yield* BrowserHost.mountEffect(MenuApp, {}, container)
          yield* settleDom
          const element = container.querySelector("ui-menu") as MenuElement
          const trigger = container.querySelector("ui-menu-trigger button") as HTMLButtonElement
          expect(element).toBeInstanceOf(customElements.get("ui-menu")!)

          expect(element.open).toBe(false)
          expect(trigger.getAttribute("aria-expanded")).toBe("false")

          // The trigger is the user's press: the element opens, `openchange`
          // comes back, and the Model's `open` writes the same property again.
          trigger.click()
          yield* settleDom
          expect(element.open).toBe(true)
          expect(root.model()).toEqual({ open: true, ran: "" })
          expect(trigger.getAttribute("aria-expanded")).toBe("true")

          // The content is portalled next to the mount, not inside it.
          const item = document.querySelector("ui-menu-item[value='rename']") as HTMLElement
          expect(item).not.toBeNull()
          item.click()
          yield* settleDom

          expect(root.model()).toEqual({ open: false, ran: "rename" })
          expect(element.open).toBe(false)
        })
      )
    } finally {
      clearPage()
    }
  })
})

describe("@boozedog/effect-ui-sdk/testing", () => {
  it("mounts a primitive from markup and reports its state", async () => {
    const view = mount(toggle, {}, "<root></root>")
    try {
      await settle()
      const root = view.part("root")
      expect(root).toBeDefined()
      expect(view.state.pressed).toBe(false)

      // The kit's click is the browser's sequence: pointerdown, mousedown,
      // pointerup, mouseup, click.
      await view.click(root!)
      await settle()

      expect(view.state.pressed).toBe(true)
      expect(root!.getAttribute("aria-pressed")).toBe("true")
      expect(view.changes.map((change) => change.key)).toContain("pressed")
      expect(view.settled.map((change) => change.value)).toContain(true)
    } finally {
      view.unmount()
    }
  })
})

describe("@boozedog/effect-ui-sdk/history", () => {
  it("starts empty and describes an entry", () => {
    const history = createHistory(createAgent())
    try {
      expect(history.entries()).toEqual([])
      expect(history.position()).toBe(0)

      let heard = 0
      const stop = history.subscribe(() => heard++)
      history.clear()
      expect(heard).toBe(1)
      stop()
      history.clear()
      expect(heard).toBe(1)
    } finally {
      history.destroy()
    }

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
