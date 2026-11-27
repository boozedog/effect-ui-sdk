// `value` is a number inside min..max. The two buttons drive the Model, and
// the element paints the fill, the visible value and the accessible one.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Meter from "@boozedog/effect-ui-sdk/meter"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

const clamp = (value: number): number => Math.min(100, Math.max(0, value))

const Message = UiSchema.TaggedEnum({
  Stepped: { by: Schema.Number },
})

const Model = Schema.Struct({
  value: Schema.Number,
})

const Definition = Html.component({
  name: "SinkMeter",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: 68 }),
  update: {
    Stepped: ($, { by }) => $.evolve({ value: clamp($.model.value + by) }),
  },
  view: (h, model) =>
    tile(
      h,
      "meter",
      "A Meter has no events: the value is a property, and its label, visible value and fill all follow it. These buttons change the Model.",
      `value ${model.value}`,
      h.div
        .style({ display: "grid", gap: "0.5rem" })
        .children(
          Meter.Root(h)
            .value(model.value)
            .min(0)
            .max(100)
            .children(
              Meter.Label(h).children("Storage used"),
              Meter.Value(h),
              Meter.Track(h).children(Meter.Indicator(h))
            ),
          h.div
            .style({ display: "flex", gap: "0.375rem" })
            .children(
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Stepped({ by: -10 }))
                .children("-10"),
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Stepped({ by: 10 }))
                .children("+10")
            )
        )
    ),
})

export { Definition as MeterTile }
