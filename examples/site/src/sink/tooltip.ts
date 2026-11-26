import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Tooltip from "@boozedog/effect-ui-sdk/tooltip"
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
  name: "SinkTooltip",
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
      "tooltip",
      "open is the element's property. toggleable lets a press open and close it, so a click round-trips as well as hover and focus. openchange carries the value it moved to.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      Tooltip.Root(h)
        .open(model.open)
        .toggleable(true)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Tooltip.Trigger(h).children(h.button.attr("type", "button").children("Hint")),
          Tooltip.Content(h).children("Add to library")
        )
    ),
})

export { Definition as TooltipTile }
