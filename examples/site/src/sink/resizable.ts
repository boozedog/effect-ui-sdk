// `layout` is one percentage per panel. A drag on the handle or an arrow key
// on it replaces the array, and layoutchange reports the new one.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Resizable from "@boozedog/effect-ui-sdk/resizable"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedLayout: {
    layout: Schema.Array(Schema.Number),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  layout: Schema.Array(Schema.Number),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkResizable",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ layout: [40, 60], reason: "", source: "" }),
  update: {
    // Copied, so the Model never holds the array the element handed over.
    ChangedLayout: ($, { layout, reason, source }) =>
      $.evolve({ layout: layout.slice(), reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "resizable",
      "layout is the panels' sizes, one percentage each. Dragging the handle or pressing an arrow key on it replaces the array, and layoutchange reports it.",
      `${model.layout.map((size) => Math.round(size)).join(" / ")}; ${reported(model.reason, model.source)}`,
      Resizable.Root(h)
        .layout(model.layout)
        .step(5)
        .style({ height: "6rem", minHeight: "0", fontSize: "0.75rem" })
        .on("layoutchange", ({ value, reason, source }) =>
          Message.ChangedLayout({ layout: value, reason, source })
        )
        .children(
          Resizable.Panel(h)
            .prop("id", "left")
            .style({ display: "grid", placeItems: "center" })
            .children(`left ${Math.round(model.layout[0] ?? 0)}%`),
          Resizable.Handle(h).attr("aria-label", "Resize panels"),
          Resizable.Panel(h)
            .prop("id", "right")
            .style({ display: "grid", placeItems: "center" })
            .children(`right ${Math.round(model.layout[1] ?? 0)}%`)
        )
    ),
})

export { Definition as ResizableTile }
