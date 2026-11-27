// `value` and `valuechange` live on Radio.Group, not on the radios. Each radio
// carries only its own value, and a label outside it holds the text.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Radio from "@boozedog/effect-ui-sdk/radio"
import { Props } from "./face"
import { reported, tile } from "./shell"

const PLANS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const

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
  name: "SinkRadio",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "monthly", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "radio",
      "The group holds one value and the radios hold none. A click or an arrow key moves it, and the group's valuechange reports where it landed.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      Radio.Group(h)
        .value(model.value)
        .attr("aria-label", "Billing plan")
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          ...PLANS.map((plan) =>
            h.label
              .attr("data-slot", "label")
              .children(
                Radio.Root(h)
                  .value(plan.value)
                  .children(Radio.Indicator(h)),
                plan.label
              )
          )
        )
    ),
})

export { Definition as RadioTile }
