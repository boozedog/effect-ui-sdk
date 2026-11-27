// `ui-label` wraps the control instead of pointing at it, so no id is needed.
// A press on the label focuses the input, which the Model counts. The input's
// own value round-trips through the native `input` event.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Label from "@boozedog/effect-ui-sdk/label"
import { Props } from "./face"
import { tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
  },
  Focused: {},
})

const Model = Schema.Struct({
  value: Schema.String,
  focused: Schema.Number,
})

const Definition = Html.component({
  name: "SinkLabel",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", focused: 0 }),
  update: {
    ChangedValue: ($, { value }) => $.evolve({ value }),
    Focused: ($) => $.evolve({ focused: $.model.focused + 1 }),
  },
  view: (h, model) =>
    tile(
      h,
      "label",
      "The label wraps the control, so a press anywhere on it reaches the input. Each focus it causes is counted, and the input's value is the Model's.",
      `value ${model.value === "" ? "(empty)" : `"${model.value}"`}; focused ${model.focused}`,
      Label.Root(h).children(
        h.span.children("Label:"),
        h.input
          .attr("type", "text")
          .attr("placeholder", "Press the label")
          .value(model.value)
          .on("input", ({ value }) => Message.ChangedValue({ value }))
          .on("focus", () => Message.Focused())
      )
    ),
})

export { Definition as LabelTile }
