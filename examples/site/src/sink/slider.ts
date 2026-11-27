// `value` is `number | ReadonlyArray<number>`. The array lives in the Model
// and is replaced only in update, so the host can skip an unchanged write.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Slider from "@boozedog/effect-ui-sdk/slider"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.Array(Schema.Number),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.Array(Schema.Number),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkSlider",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: [40], reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "slider",
      "value is a number or an array of numbers, one per thumb. Arrow keys and a press on the control move it, and valuechange reports the value the element moved to.",
      `value ${model.value.join(", ")}; ${reported(model.reason, model.source)}`,
      Slider.Root(h)
        .class(face(h.props.daisy, classes.slider))
        .value(model.value)
        .min(0)
        .max(100)
        .step(1)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({
            value: typeof value === "number" ? [value] : value,
            reason,
            source,
          })
        )
        .children(
          h.div.attr("data-slot", "row").children(Slider.Value(h)),
          Slider.Control(h).children(
            Slider.Track(h)
              .class(face(h.props.daisy, classes.sliderTrack))
              .children(
                Slider.Indicator(h).class(face(h.props.daisy, classes.sliderIndicator)),
                Slider.Thumb(h)
                  .class(face(h.props.daisy, classes.sliderThumb))
                  .attr("aria-label", "Volume")
              )
          )
        )
    ),
})

export { Definition as SliderTile }
