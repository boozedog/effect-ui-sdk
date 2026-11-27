import { Command, UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Effect, Schema } from "effect"
import { createToaster } from "@ui-sdk/web/toast"
import * as Toast from "@boozedog/effect-ui-sdk/toast"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

// One queue for this tile only, created once: the region compares the
// reference, so a toaster made per render would be written on every patch.
const toaster = createToaster()

const Message = UiSchema.TaggedEnum({
  Asked: {},
  Pushed: {},
})

const Model = Schema.Struct({
  sent: Schema.Number,
})

// Showing a toast is a side effect, so it runs in a Command and the count
// changes on the message it sends back.
const ShowToast = Command.make("ShowToast", {}, () =>
  Effect.sync(() => {
    toaster("Saved to drafts", {
      description: "The toast closes on its own, or from its action.",
      action: { label: "Undo" },
    })
    return Message.Pushed()
  })
)

const Definition = Html.component({
  name: "SinkToast",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ sent: 0 }),
  update: {
    Asked: ($) => $.run(ShowToast.make()),
    Pushed: ($) => $.evolve({ sent: $.model.sent + 1 }),
  },
  view: (h, model) =>
    tile(
      h,
      "toast",
      "The region shows one toaster's queue. Showing a toast is a side effect, so the press runs a Command and the count moves on the message it sends back.",
      `sent ${model.sent}`,
      h.div.style({ display: "grid", gap: "0.5rem" }).children(
        h.button
          .attr("type", "button")
          .class(face(h.props.daisy, classes.button))
          .on("click", () => Message.Asked())
          .children("Save draft"),
        // The region is placed here and takes this toaster's queue.
        Toast.Region(h).toaster(toaster).attr("aria-label", "Notifications")
      )
    ),
})

export { Definition as ToastTile }
