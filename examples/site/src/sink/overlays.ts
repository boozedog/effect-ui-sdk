import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { createConfirm } from "@ui-sdk/core/dialog"
import { createOverlays } from "@ui-sdk/core/overlays"
import * as Overlays from "@boozedog/effect-ui-sdk/overlays"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

// One registry and one host, both stable: the host keeps the registry it was
// given, and the confirm helper opens into the same one.
const localOverlays = createOverlays()
const localConfirm = createConfirm({ overlays: localOverlays })

const Message = UiSchema.TaggedEnum({
  Asked: {},
})

const Model = Schema.Struct({
  asked: Schema.Number,
})

const Definition = Html.component({
  name: "SinkOverlays",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ asked: 0 }),
  update: {
    Asked: ($) => $.evolve({ asked: $.model.asked + 1 }),
  },
  view: (h, model) =>
    tile(
      h,
      "overlays",
      "A host renders a registry of overlays: the confirm question here, and a toaster's region if one asked it to. Mount one host, and open overlays from anywhere.",
      `asked ${model.asked}`,
      h.div.style({ display: "grid", gap: "0.5rem" }).children(
        h.button
          .attr("type", "button")
          .class(face(h.props.daisy, classes.button))
          .on("click", () => {
            void localConfirm({
              title: "Delete this project?",
              description: "The project and its history go away for everyone.",
              confirmLabel: "Delete",
            })
            return Message.Asked()
          })
          .children("Ask to delete"),
        Overlays.OverlayHost(h).overlays(localOverlays)
      )
    ),
})

export { Definition as OverlaysTile }
