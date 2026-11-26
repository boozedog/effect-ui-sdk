import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Toggle from "@boozedog/effect-ui-sdk/toggle"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedPressed: {
    pressed: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  pressed: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkToggle",
  model: Model,
  message: Message,
}).make({
  init: () => ({ pressed: false, reason: "", source: "" }),
  update: {
    ChangedPressed: ($, { pressed, reason, source }) => $.evolve({ pressed, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "toggle",
      "pressed is a property on the element. The click changes it first, then pressedchange carries the new value back.",
      `pressed ${model.pressed}; ${reported(model.reason, model.source)}`,
      Toggle.Root(h)
        .pressed(model.pressed)
        .on("pressedchange", ({ value, reason, source }) =>
          Message.ChangedPressed({ pressed: value, reason, source })
        )
        .children(h.button.attr("type", "button").children(model.pressed ? "Pinned" : "Pin"))
    ),
})

export { Definition as ToggleTile }
