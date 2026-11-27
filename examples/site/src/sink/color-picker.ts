// `value` is a CSS color string. Every part edits the same value, and
// valuechange reports the color the element moved to.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as ColorPicker from "@boozedog/effect-ui-sdk/color-picker"
import { Props } from "./face"
import { reported, tile } from "./shell"

const PRESETS = ["#ef4444", "#22c55e", "#3b82f6"] as const

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
  name: "SinkColorPicker",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "#3b82f6", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "color-picker",
      "value is the color, as CSS. The area, the hue slider, the presets and the text field all set it, and valuechange reports each move.",
      `value ${model.value}; ${reported(model.reason, model.source)}`,
      ColorPicker.Root(h)
        .attr("aria-label", "Accent color")
        .value(model.value)
        .format("hex")
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          // The area defaults to 10rem tall; a tile wants it shorter.
          ColorPicker.Area(h)
            .style({ height: "6rem" })
            .children(
              ColorPicker.AreaCanvas(h),
              ColorPicker.AreaThumb(h).attr("aria-label", "Saturation and brightness")
            ),
          ColorPicker.Slider(h)
            .channel("hue")
            .children(ColorPicker.SliderThumb(h).attr("aria-label", "Hue")),
          h.div.children(
            ColorPicker.Swatch(h),
            h.div.children(
              ColorPicker.Input(h).children(
                h.input.attr("aria-label", "Hex color").attr("type", "text")
              ),
              ColorPicker.Swatches(h)
                .attr("aria-label", "Presets")
                .children(
                  ...PRESETS.map((preset) =>
                    ColorPicker.SwatchItem(h).value(preset)
                  )
                )
            )
          )
        )
    ),
})

export { Definition as ColorPickerTile }
