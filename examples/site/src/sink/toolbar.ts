// A toolbar is one tab stop for a group of controls. Toolbar declares no
// events, so the round-trip is each wrapped button's own click.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Toolbar from "@boozedog/effect-ui-sdk/toolbar"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

const GROUPS = [
  { label: "Style", actions: ["bold", "italic"] },
  { label: "Align", actions: ["left", "right"] },
] as const

const Message = UiSchema.TaggedEnum({
  Clicked: {
    action: Schema.String,
  },
})

const Model = Schema.Struct({
  action: Schema.String,
})

const Definition = Html.component({
  name: "SinkToolbar",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ action: "" }),
  update: {
    Clicked: ($, { action }) => $.evolve({ action }),
  },
  view: (h, model) =>
    tile(
      h,
      "toolbar",
      "A toolbar gives its controls one tab stop: Tab enters it once, then the arrow keys move between them. Each part wraps your own button, and its click is the round-trip.",
      `last action ${model.action === "" ? "(none)" : model.action}`,
      Toolbar.Root(h)
        .attr("aria-label", "Formatting")
        .children(
          ...GROUPS.map((group, index) =>
            index === 0
              ? Toolbar.Group(h)
                  .attr("aria-label", group.label)
                  .children(...buttons(h, h.props.daisy, group.actions))
              : [
                  Toolbar.Separator(h),
                  Toolbar.Group(h)
                    .attr("aria-label", group.label)
                    .children(...buttons(h, h.props.daisy, group.actions)),
                ]
          ).flat()
        )
    ),
})

// One action button per label. The class goes on the real button, not the part.
function buttons(h: Html.H<typeof Message.Type>, daisy: boolean, actions: readonly string[]) {
  return actions.map((action) =>
    Toolbar.Button(h).children(
      h.button
        .attr("type", "button")
        .class(face(daisy, classes.button))
        .on("click", () => Message.Clicked({ action }))
        .children(action)
    )
  )
}

export { Definition as ToolbarTile }
