import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { createPreference } from "@ui-sdk/web/preferences"
import * as Preferences from "@boozedog/effect-ui-sdk/preferences"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

// The preference and the list the element takes are both created once, so the
// array keeps its reference across renders and the element is not rewritten.
const density = createPreference({
  values: ["comfortable", "compact"],
  defaultValue: "comfortable",
  attribute: "data-density",
})
const preferenceList = [density]

const Density = Schema.Literals(["comfortable", "compact"])

const Message = UiSchema.TaggedEnum({
  Toggled: {
    value: Density,
  },
})

const Model = Schema.Struct({
  density: Density,
})

const other = (value: "comfortable" | "compact"): "comfortable" | "compact" =>
  value === "compact" ? "comfortable" : "compact"

const Definition = Html.component({
  name: "SinkPreferences",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ density: density.initialState.value }),
  update: {
    Toggled: ($, { value }) => $.evolve({ density: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "preferences",
      "The element writes each preference's value to its data attribute and follows every change. Style by the attribute; the element itself adds no box.",
      `density ${model.density}`,
      Preferences.Root(h).preferences(preferenceList).children(
        h.div.style({ display: "grid", gap: "0.5rem" }).children(
          h.button
            .attr("type", "button")
            .class(face(h.props.daisy, classes.button))
            .on("click", () => {
              const value = other(model.density)
              // The element writes the attribute; the Model keeps the readout.
              density.set(value, { reason: "press" })
              return Message.Toggled({ value })
            })
            .children(model.density === "compact" ? "Compact rows" : "Comfortable rows"),
          h.p.children(
            "This paragraph is styled by the element's data attribute."
          )
        )
      )
    ),
})

export { Definition as PreferencesTile }
