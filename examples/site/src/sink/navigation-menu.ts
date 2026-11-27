import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as NavigationMenu from "@boozedog/effect-ui-sdk/navigation-menu"
import { Props } from "./face"
import { reported, tile } from "./shell"

// `value` is the open section's id, or null when every panel is closed. The
// viewport holds whichever panel is open.
const SECTIONS = [
  {
    value: "guides",
    label: "Guides",
    links: [
      { label: "Introduction", href: "#sink-navigation-menu" },
      { label: "Installation", href: "#sink-navigation-menu" },
    ],
  },
  {
    value: "api",
    label: "API",
    links: [{ label: "Components", href: "#sink-navigation-menu" }],
  },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkNavigationMenu",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: null, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "navigation-menu",
      "value is the open section. Triggers and links wrap your own button and anchor, so both stay what they are, and valuechange reports the section the menu moved to.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      NavigationMenu.Root(h)
        .value(model.value)
        .attr("aria-label", "Main")
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          NavigationMenu.List(h).children(
            ...SECTIONS.map((section) =>
              NavigationMenu.Item(h)
                .value(section.value)
                .children(
                  NavigationMenu.Trigger(h).children(
                    h.button.attr("type", "button").children(section.label)
                  ),
                  NavigationMenu.Content(h).children(
                    ...section.links.map((link) =>
                      NavigationMenu.Link(h).children(
                        h.a.attr("href", link.href).children(link.label)
                      )
                    )
                  )
                )
            )
          ),
          NavigationMenu.Viewport(h)
        )
    ),
})

export { Definition as NavigationMenuTile }
