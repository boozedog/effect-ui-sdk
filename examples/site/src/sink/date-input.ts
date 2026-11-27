// The input renders one segment per part of the date, in the order the locale
// writes it, so there is no child markup to write. value stays null until
// every segment holds something.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as DateInput from "@boozedog/effect-ui-sdk/date-input"
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
  name: "SinkDateInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "2026-11-27", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "date-input",
      "Each part of the date is its own field, in the locale's order. value is an ISO date, and it stays null until every part is filled.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      DateInput.Root(h)
        .attr("aria-label", "Start date")
        .value(model.value)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
    ),
})

export { Definition as DateInputTile }
