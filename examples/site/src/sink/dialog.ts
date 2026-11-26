import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Dialog from "@boozedog/effect-ui-sdk/dialog"
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
  name: "SinkDialog",
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
      "dialog",
      "open is the element's own property. The trigger asks it to open, and Escape or a press outside asks it to close. Each request comes back as openchange.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      Dialog.Root(h)
        .open(model.open)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Dialog.Trigger(h).children(
            h.button.attr("type", "button").children(model.open ? "Dialog is open" : "Open dialog")
          ),
          Dialog.Content(h).children(
            Dialog.Title(h).children("A bound dialog"),
            h.p.children(
              "Focus moves inside, the page behind is inert, and Escape asks the dialog to close."
            ),
            Dialog.Close(h).children(h.button.attr("type", "button").children("Close"))
          )
        )
    ),
})

export { Definition as DialogTile }
