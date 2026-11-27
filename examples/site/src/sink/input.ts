// `ui-input` wraps your own `<input>`, so attributes such as `type` and
// `placeholder` go on the child. The clear part is a `<ui-input-clear>` around
// your own button, so it stays a plain field control, not a daisy action.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Input from "@boozedog/effect-ui-sdk/input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "input",
      "value is the element's property. Typing, and a press on the clear part, change it first, then valuechange carries the text back.",
      `value ${model.value === "" ? "(empty)" : `"${model.value}"`}; ${reported(model.reason, model.source)}`,
      Input.Group(h).children(
        Input.Root(h)
          .value(model.value)
          .on("valuechange", ({ value, reason, source }) =>
            Message.ChangedValue({ value, reason, source })
          )
          .children(
            h.input
              .attr("type", "text")
              .attr("aria-label", "Display name")
              .attr("placeholder", "Ada Lovelace")
          ),
        Input.Clear(h).children(
          h.button.attr("type", "button").attr("aria-label", "Clear display name").children("×")
        )
      )
    ),
})

export { Definition as InputTile }
