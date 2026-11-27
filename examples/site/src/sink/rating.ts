// A star isn't a choice; the radios inside each item are. The element makes one
// item per star, and `web.css` paints each item's star, so no template is
// needed and the markup stays small.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Rating from "@boozedog/effect-ui-sdk/rating"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.Number),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.Number),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkRating",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: 3, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "rating",
      "value is the score, or null when nothing is chosen. Stars are items of radios, and the stylesheet paints each one. valuechange reports the score it moved to.",
      `value ${model.value ?? "(none)"} of 5; ${reported(model.reason, model.source)}`,
      Rating.Root(h)
        .value(model.value)
        .max(5)
        .attr("aria-label", "Stay rating")
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
    ),
})

export { Definition as RatingTile }
