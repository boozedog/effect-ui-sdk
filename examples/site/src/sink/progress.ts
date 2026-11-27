// `value` is `number | null`. `null` is the indeterminate state: every part
// gets `data-indeterminate` and the indicator gets no inline width.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Progress from "@boozedog/effect-ui-sdk/progress"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

const clamp = (value: number): number => Math.min(100, Math.max(0, value))

const Message = UiSchema.TaggedEnum({
  Stepped: { by: Schema.Number },
  WentIndeterminate: {},
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.Number),
})

const Definition = Html.component({
  name: "SinkProgress",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: 40 }),
  update: {
    Stepped: ($, { by }) =>
      $.evolve({ value: clamp(($.model.value ?? 0) + by) }),
    WentIndeterminate: ($) => $.evolve({ value: null }),
  },
  view: (h, model) =>
    tile(
      h,
      "progress",
      "A Progress has no events: the value is a property. Leaving it out is the indeterminate state, and null is how this Model says that.",
      `value ${model.value === null ? "(indeterminate)" : model.value}`,
      h.div
        .style({ display: "grid", gap: "0.5rem" })
        .children(
          Progress.Root(h)
            .value(model.value)
            .min(0)
            .max(100)
            .children(
              Progress.Label(h).children("Exporting video"),
              Progress.Value(h),
              Progress.Track(h).children(Progress.Indicator(h))
            ),
          h.div
            .style({ display: "flex", flexWrap: "wrap", gap: "0.375rem" })
            .children(
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Stepped({ by: -20 }))
                .children("-20"),
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Stepped({ by: 20 }))
                .children("+20"),
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.WentIndeterminate())
                .children("Indeterminate")
            )
        )
    ),
})

export { Definition as ProgressTile }
