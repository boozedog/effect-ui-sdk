// Button's generated binding declares no events. The inner button's click is
// the round-trip. An undeclared `action` event is not wired.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Button from "@boozedog/effect-ui-sdk/button"
import { tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  Clicked: {},
})

const Model = Schema.Struct({
  clicks: Schema.Number,
})

const Definition = Html.component({
  name: "SinkButton",
  model: Model,
  message: Message,
}).make({
  init: () => ({ clicks: 0 }),
  update: {
    Clicked: ($) => $.evolve({ clicks: $.model.clicks + 1 }),
  },
  view: (h, model) =>
    tile(
      h,
      "button",
      "The binding declares no events, so the count is the inner button's click. The wrapper still supplies the pending and disabled behaviour.",
      `clicks ${model.clicks}`,
      Button.Root(h).children(
        h.button.attr("type", "button").on("click", () => Message.Clicked()).children("Run action")
      )
    ),
})

export { Definition as ButtonTile }
