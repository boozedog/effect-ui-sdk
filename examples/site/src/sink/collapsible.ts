import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Collapsible from "@boozedog/effect-ui-sdk/collapsible"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkCollapsible",
  model: Model,
  message: Message,
}).make({
  init: () => ({ open: false, reason: "", source: "" }),
  update: {
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "collapsible",
      "open is the element's property. The trigger asks it to show or hide the panel, and openchange carries the value it moved to.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      Collapsible.Root(h)
        .open(model.open)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Collapsible.Trigger(h).children(
            h.button.attr("type", "button").children("Order details")
          ),
          Collapsible.Panel(h).children(h.p.children("3 items, $84.00"))
        )
    ),
})

export { Definition as CollapsibleTile }
