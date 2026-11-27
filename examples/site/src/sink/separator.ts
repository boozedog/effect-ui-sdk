import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Separator from "@boozedog/effect-ui-sdk/separator"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

// A separator divides two groups a reader should hear as separate. Orientation
// is a bound property, so the Model decides whether it draws across or down.
const Message = UiSchema.TaggedEnum({
  Toggled: {},
})

const Model = Schema.Struct({
  orientation: Schema.Literals(["horizontal", "vertical"]),
})

const other = (orientation: "horizontal" | "vertical"): "horizontal" | "vertical" =>
  orientation === "horizontal" ? "vertical" : "horizontal"

const Definition = Html.component({
  name: "SinkSeparator",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ orientation: "horizontal" }),
  update: {
    Toggled: ($) => $.evolve({ orientation: other($.model.orientation) }),
  },
  view: (h, model) =>
    tile(
      h,
      "separator",
      "orientation is the element's property, and it sets aria-orientation with it. A horizontal line spans its container; a vertical one takes the height of the row it divides.",
      `orientation ${model.orientation}`,
      h.div.style({ display: "grid", gap: "0.5rem" }).children(
        h.button
          .attr("type", "button")
          .class(face(h.props.daisy, classes.button))
          .on("click", () => Message.Toggled())
          .children(`Draw ${other(model.orientation)}`),
        h.div
          .style({ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: "2rem" })
          .children(
            h.span.children("Plan"),
            Separator.Root(h).orientation(model.orientation),
            h.span.children("Pro")
          )
      )
    ),
})

export { Definition as SeparatorTile }
