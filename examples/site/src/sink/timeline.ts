// `status` is `complete`, `current` or `upcoming`, and it is derived from the
// Model's active step, so one button drives all three items.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Timeline from "@boozedog/effect-ui-sdk/timeline"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

const STEPS = [
  { value: "placed", title: "Order placed", description: "We received your order." },
  { value: "packed", title: "Packed", description: "Your items left the shelf." },
  { value: "shipped", title: "Shipped", description: "On its way with the carrier." },
] as const

const statusOf = (index: number, step: number): "complete" | "current" | "upcoming" =>
  index < step ? "complete" : index === step ? "current" : "upcoming"

const Message = UiSchema.TaggedEnum({
  Advanced: {},
  Reset: {},
})

const Model = Schema.Struct({
  step: Schema.Number,
})

const Definition = Html.component({
  name: "SinkTimeline",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ step: 1 }),
  update: {
    Advanced: ($) => $.evolve({ step: ($.model.step + 1) % STEPS.length }),
    Reset: ($) => $.evolve({ step: 0 }),
  },
  view: (h, model) =>
    tile(
      h,
      "timeline",
      "A Timeline has no events. Each item's status is a prop, here derived from the Model's active step, so the markup and the readout always agree.",
      `step ${STEPS[model.step]?.title ?? "(none)"}`,
      h.div
        .style({ display: "grid", gap: "0.5rem" })
        .children(
          Timeline.Root(h)
            .attr("aria-label", "Order status")
            .children(
              ...STEPS.map((step, index) =>
                Timeline.Item(h)
                  .value(step.value)
                  .status(statusOf(index, model.step))
                  .children(
                    Timeline.Marker(h).children(
                      statusOf(index, model.step) === "complete" ? "✓" : ""
                    ),
                    Timeline.Connector(h),
                    Timeline.Title(h).children(step.title),
                    Timeline.Description(h).children(step.description)
                  )
              )
            ),
          h.div
            .style({ display: "flex", gap: "0.375rem" })
            .children(
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Advanced())
                .children("Next step"),
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .on("click", () => Message.Reset())
                .children("Reset")
            )
        )
    ),
})

export { Definition as TimelineTile }
