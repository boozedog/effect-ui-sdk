// `value` is the text, always a string: suggestions only fill it in, and any
// text is valid. `open` is the suggestion list. The suggestions are a module
// constant, so a render never hands the element a fresh array.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Autocomplete from "@boozedog/effect-ui-sdk/autocomplete"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const FRUITS = ["Apple", "Banana", "Cherry", "Grape", "Mango"] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.String,
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkAutocomplete",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "", open: false, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "autocomplete",
      "value is the text, and any text is valid. Suggestions only fill it in. valuechange carries the text and openchange the list's open state.",
      `value ${model.value === "" ? "(empty)" : `"${model.value}"`}; open ${model.open}; ${reported(model.reason, model.source)}`,
      Autocomplete.Root(h)
        .value(model.value)
        .open(model.open)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Autocomplete.Input(h).children(
            h.input
              .attr("aria-label", "Favorite fruit")
              .attr("placeholder", "Type a fruit")
          ),
          Autocomplete.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              Autocomplete.Empty(h).children("No fruits found."),
              Autocomplete.List(h).children(
                ...FRUITS.map((fruit) =>
                  Autocomplete.Item(h)
                    .value(fruit)
                    .class(face(h.props.daisy, classes.item))
                    .children(fruit)
                )
              )
            )
        )
    ),
})

export { Definition as AutocompleteTile }
