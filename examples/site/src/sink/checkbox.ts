import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Checkbox from "@boozedog/effect-ui-sdk/checkbox"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Checked = Schema.Union([Schema.Boolean, Schema.Literal("indeterminate")])

const Message = UiSchema.TaggedEnum({
  ChangedChecked: {
    checked: Checked,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  checked: Checked,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkCheckbox",
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
      "checkbox",
      "checked is the element's property. The label sits outside ui-checkbox. checkedchange carries the value the element moved to.",
      `checked ${model.checked}; ${reported(model.reason, model.source)}`,
      h.label.children(
        Checkbox.Root(h)
          .class(face(h.props.daisy, classes.checkbox))
          .checked(model.checked)
          .on("checkedchange", ({ value, reason, source }) =>
            Message.ChangedChecked({ checked: value, reason, source })
          )
          .children(Checkbox.Indicator(h).class(face(h.props.daisy, classes.checkboxIndicator))),
        "Accept terms"
      )
    ),
})

export { Definition as CheckboxTile }
