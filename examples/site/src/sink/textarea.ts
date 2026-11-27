// `ui-textarea` wraps your own `<textarea>`, so `rows` and `maxlength` stay on
// the child. The value is controlled, and `valuechange` reports every change.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Textarea from "@boozedog/effect-ui-sdk/textarea"
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
  name: "SinkTextarea",
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
      "textarea",
      "value is the element's property, and auto-resize grows the field with it. valuechange reports each edit with its reason.",
      `${model.value.length} chars; ${reported(model.reason, model.source)}`,
      Textarea.Root(h)
        .value(model.value)
        .autoResize(true)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          h.textarea
            .attr("aria-label", "Trip note")
            .attr("rows", "2")
            .attr("maxlength", "280")
            .attr("placeholder", "What should we know?")
        )
    ),
})

export { Definition as TextareaTile }
