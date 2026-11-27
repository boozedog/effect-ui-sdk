import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Dialog from "@boozedog/effect-ui-sdk/dialog"
import { classes, face, Props } from "./face"
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
  props: Props,
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
            h.button
              .attr("type", "button")
              .class(face(h.props.daisy, classes.button))
              .children(model.open ? "Dialog is open" : "Open dialog")
          ),
          // The backdrop is a real part, so it has to be rendered. Without it
          // the page behind the dialog stays lit (native `::backdrop` is
          // transparent, and UISDK paints `[data-slot=dialog-backdrop]`).
          Dialog.Backdrop(h),
          Dialog.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              Dialog.Title(h).children("A bound dialog"),
              h.p.children(
                "Focus moves inside, the page behind is inert, and Escape asks the dialog to close."
              ),
              Dialog.Close(h).children(
                h.button
                  .attr("type", "button")
                  .class(face(h.props.daisy, classes.button))
                  .children("Close")
              )
            )
        )
    ),
})

export { Definition as DialogTile }
