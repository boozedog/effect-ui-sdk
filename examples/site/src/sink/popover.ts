import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Popover from "@boozedog/effect-ui-sdk/popover"
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
  name: "SinkPopover",
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
      "popover",
      "open is the element's property. The trigger asks it to open, and a press outside or Escape asks it to close. openchange carries the value it moved to.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      Popover.Root(h)
        .open(model.open)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Popover.Trigger(h).children(h.button.attr("type", "button").children("Share")),
          Popover.Content(h).children(
            Popover.Title(h).children("Share this document"),
            Popover.Description(h).children("Anyone with the link can view it.")
          )
        )
    ),
})

export { Definition as PopoverTile }
