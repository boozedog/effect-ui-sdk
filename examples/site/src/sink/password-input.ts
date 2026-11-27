// `value` and `visible` are both properties on the element. The toggle is a
// `<ui-password-input-toggle>` around your own button, so it stays part of the
// field and the caret stays in the input.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as PasswordInput from "@boozedog/effect-ui-sdk/password-input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedVisible: {
    visible: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.String,
  visible: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkPasswordInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", visible: false, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedVisible: ($, { visible, reason, source }) =>
      $.evolve({ visible, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "password-input",
      "value and visible are properties. Typing changes the text, the toggle changes visible, and each change reports through its own event.",
      `value ${"•".repeat(model.value.length) || "(empty)"}; visible ${model.visible}; ${reported(model.reason, model.source)}`,
      PasswordInput.Root(h)
        .value(model.value)
        .visible(model.visible)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .on("visiblechange", ({ value, reason, source }) =>
          Message.ChangedVisible({ visible: value, reason, source })
        )
        .children(
          h.input
            .attr("type", "password")
            .attr("aria-label", "Passphrase")
            .attr("autocomplete", "current-password")
            .attr("placeholder", "At least 8 characters"),
          PasswordInput.Toggle(h).children(
            h.button.attr("type", "button").attr("aria-label", "Show or hide passphrase").children(
              model.visible ? "Hide" : "Show"
            )
          )
        )
    ),
})

export { Definition as PasswordInputTile }
