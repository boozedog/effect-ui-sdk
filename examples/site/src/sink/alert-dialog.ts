import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as AlertDialog from "@boozedog/effect-ui-sdk/alert-dialog"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

// An alert dialog asks a question: the page behind is inert and a press
// outside leaves it open, so only the two Close parts (or Escape) answer it.
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
  name: "SinkAlertDialog",
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
      "alert-dialog",
      "An alert dialog wants an answer. The page behind is inert and a press outside does not close it, so only the two Close parts answer it, and each one reports openchange.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      AlertDialog.Root(h)
        .open(model.open)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          AlertDialog.Trigger(h).children(
            h.button
              .attr("type", "button")
              .class(face(h.props.daisy, classes.button))
              .children(model.open ? "Asking…" : "Delete project")
          ),
          // The backdrop is a real part: without it the page behind stays lit.
          AlertDialog.Backdrop(h),
          AlertDialog.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              AlertDialog.Title(h).children("Delete this project?"),
              AlertDialog.Description(h).children(
                "The project and its deployment history go away for everyone on the team."
              ),
              AlertDialog.Close(h).children(
                h.button
                  .attr("type", "button")
                  .class(face(h.props.daisy, classes.button))
                  .children("Cancel")
              ),
              // `value="confirm"` is the agreeing answer the confirm helper reads.
              AlertDialog.Close(h).value("confirm").children(
                h.button
                  .attr("type", "button")
                  .class(face(h.props.daisy, classes.button))
                  .children("Delete")
              )
            )
        )
    ),
})

export { Definition as AlertDialogTile }
