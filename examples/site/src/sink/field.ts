// A field has no events of its own. `invalid` is its property, and the Model
// sets it from what is typed, so an empty value shows the error at once. The
// button flips the same property, so the round-trip is visible both ways.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Field from "@boozedog/effect-ui-sdk/field"
import * as Input from "@boozedog/effect-ui-sdk/input"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  ToggledInvalid: {
    invalid: Schema.Boolean,
  },
})

const Model = Schema.Struct({
  value: Schema.String,
  invalid: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkField",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", invalid: true, reason: "", source: "" }),
  update: {
    // An empty value is the invalid one, so typing clears the error.
    ChangedValue: ($, { value, reason, source }) =>
      $.evolve({ value, invalid: value.trim() === "", reason, source }),
    ToggledInvalid: ($, { invalid }) => $.evolve({ invalid }),
  },
  view: (h, model) =>
    tile(
      h,
      "field",
      "A field has no events. invalid is its property, the Model sets it from the value, and the button flips it back.",
      `value ${model.value === "" ? "(empty)" : `"${model.value}"`}; invalid ${model.invalid}; ${reported(model.reason, model.source)}`,
      h.div
        .attr("data-slot", "stack")
        .children(
          Field.Root(h)
            .invalid(model.invalid)
            .children(
              Field.Label(h).children("Workspace name"),
              Input.Root(h)
                .value(model.value)
                .on("valuechange", ({ value, reason, source }) =>
                  Message.ChangedValue({ value, reason, source })
                )
                .children(
                  h.input
                    .attr("type", "text")
                    .attr("placeholder", "acme")
                    .attr("autocomplete", "organization")
                ),
              Field.Description(h).children("Lowercase, no spaces."),
              Field.Error(h).children("Enter a workspace name.")
            ),
          h.button
            .attr("type", "button")
            .class(face(h.props.daisy, classes.button))
            .on("click", () => Message.ToggledInvalid({ invalid: !model.invalid }))
            .children(model.invalid ? "Clear the error" : "Raise the error")
        )
    ),
})

export { Definition as FieldTile }
