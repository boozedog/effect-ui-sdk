// Like the Date Input, the input renders one segment per part of the time in
// the locale's clock. value is always a 24-hour time such as "14:30",
// whatever clock the segments show.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as TimeInput from "@boozedog/effect-ui-sdk/time-input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkTimeInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "09:30", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "time-input",
      "Each part of the time is its own segment, following the locale's clock. value is 24-hour and stays null until every part is filled.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      TimeInput.Root(h)
        .attr("aria-label", "Meeting time")
        .hourCycle(24)
        .value(model.value)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
    ),
})

export { Definition as TimeInputTile }
