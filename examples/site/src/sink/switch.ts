import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Switch from "@boozedog/effect-ui-sdk/switch"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedChecked: {
    checked: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  checked: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkSwitch",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ checked: false, reason: "", source: "" }),
  update: {
    ChangedChecked: ($, { checked, reason, source }) => $.evolve({ checked, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "switch",
      "checked is the element's property. The label sits outside ui-switch. checkedchange carries the value the element moved to.",
      `checked ${model.checked}; ${reported(model.reason, model.source)}`,
      h.label.children(
        Switch.Root(h)
          .class(face(h.props.daisy, classes.switchRoot))
          .checked(model.checked)
          .on("checkedchange", ({ value, reason, source }) =>
            Message.ChangedChecked({ checked: value, reason, source })
          )
          .children(Switch.Thumb(h).class(face(h.props.daisy, classes.switchThumb))),
        "Airplane mode"
      )
    ),
})

export { Definition as SwitchTile }
