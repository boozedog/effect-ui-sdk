// `value` is `number | null`. The step parts wrap your own buttons, and the
// control part wraps your own `<input>`. valuechange reports each step and
// each committed edit; valuecommit reports once an interaction ends.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as NumberInput from "@boozedog/effect-ui-sdk/number-input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.Number),
    reason: Schema.String,
    source: Schema.String,
  },
  CommittedValue: {
    value: Schema.NullOr(Schema.Number),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.Number),
  committed: Schema.NullOr(Schema.Number),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkNumberInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: 2, committed: 2, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    CommittedValue: ($, { value, reason, source }) =>
      $.evolve({ committed: value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "number-input",
      "value is a number or null, and the step buttons and arrow keys change it. valuechange reports every step, and valuecommit reports once the interaction ends.",
      `value ${model.value ?? "(empty)"}; committed ${model.committed ?? "(empty)"}; ${reported(model.reason, model.source)}`,
      NumberInput.Root(h)
        .value(model.value)
        .min(0)
        .max(10)
        .step(1)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .on("valuecommit", ({ value, reason, source }) =>
          Message.CommittedValue({ value, reason, source })
        )
        .children(
          NumberInput.Group(h).children(
            NumberInput.Decrement(h).children(
              h.button.attr("type", "button").attr("aria-label", "Fewer guests").children("−")
            ),
            NumberInput.Control(h).children(
              h.input.attr("aria-label", "Guests").attr("placeholder", "0")
            ),
            NumberInput.Increment(h).children(
              h.button.attr("type", "button").attr("aria-label", "More guests").children("+")
            )
          )
        )
    ),
})

export { Definition as NumberInputTile }
