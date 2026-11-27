// The control holds one value and the items hold only their own. The indicator
// measures the checked item, so it needs to be a child of the control.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as SegmentedControl from "@boozedog/effect-ui-sdk/segmented-control"
import { Props } from "./face"
import { reported, tile } from "./shell"

const VIEWS = ["list", "grid", "board"] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkSegmentedControl",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "list", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "segmented-control",
      "value is the checked item, and the control keeps a single tab stop. A click or an arrow key moves it, and valuechange reports the item it moved to.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      SegmentedControl.Root(h)
        .value(model.value)
        .attr("aria-label", "Result view")
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          SegmentedControl.Indicator(h),
          ...VIEWS.map((view) =>
            SegmentedControl.Item(h).value(view).children(view)
          )
        )
    ),
})

export { Definition as SegmentedControlTile }
