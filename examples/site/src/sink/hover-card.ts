import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as HoverCard from "@boozedog/effect-ui-sdk/hover-card"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

// The trigger wraps a real link, so pressing it still follows the href. The
// card opens after `delay` on hover or keyboard focus.
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
  name: "SinkHoverCard",
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
      "hover-card",
      "A preview for a link. The trigger wraps your own anchor, so pressing it still navigates. Resting the pointer on it, or tabbing to it, asks the card to open.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      HoverCard.Root(h)
        .open(model.open)
        .delay(200)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          HoverCard.Trigger(h).children(
            h.a.attr("href", "#sink-hover-card").children("@hollis")
          ),
          HoverCard.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              HoverCard.Arrow(h),
              h.p.children("Hollis Grant"),
              h.p.children("Design engineer on the payments team.")
            )
        )
    ),
})

export { Definition as HoverCardTile }
