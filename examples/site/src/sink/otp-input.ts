// `value` is the whole code. Groups and separators only change how the one
// native input is presented, so the Model holds a string and the slots show
// characters of it. valuecommit fires once every slot is filled.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as OTPInput from "@boozedog/effect-ui-sdk/otp-input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const LENGTH = 6

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  CommittedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.String,
  committed: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const slots = <Msg>(h: Html.H<Msg>, count: number) =>
  Array.from({ length: count }, () => OTPInput.Slot(h))

const Definition = Html.component({
  name: "SinkOTPInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", committed: "", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    CommittedValue: ($, { value, reason, source }) =>
      $.evolve({ committed: value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "otp-input",
      "value is the whole code, and the slots only display it. valuechange reports every edit, and valuecommit fires once every slot is filled.",
      `value "${model.value}"; ${model.value.length}/${LENGTH}${model.committed === "" ? "" : `, committed "${model.committed}"`}; ${reported(model.reason, model.source)}`,
      OTPInput.Root(h)
        .value(model.value)
        .maxLength(LENGTH)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .on("valuecommit", ({ value, reason, source }) =>
          Message.CommittedValue({ value, reason, source })
        )
        .children(
          OTPInput.Group(h).children(...slots(h, 3)),
          OTPInput.Separator(h).children("–"),
          OTPInput.Group(h).children(...slots(h, 3))
        )
    ),
})

export { Definition as OTPInputTile }
