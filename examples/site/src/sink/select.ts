// `value` and `items` are Schema.Unknown. Options are ui-select-item children,
// not an `items` array. The event value is narrowed to a string or null
// before it is stored.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Select from "@boozedog/effect-ui-sdk/select"
import { reported, tile } from "./shell"

const OPTIONS = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const choiceOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkSelect",
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: null, open: false, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "select",
      "value is unknown on the binding, and this Model keeps a string. Options are item children. valuechange carries the value the element moved to.",
      `value ${model.value ?? "(none)"}; open ${model.open}; ${reported(model.reason, model.source)}`,
      Select.Root(h)
        .value(model.value)
        .open(model.open)
        .placeholder("Select a role")
        .on("valuechange", ({ value, reason, source }) => {
          const next = choiceOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Select.Trigger(h).children(
            h.button.attr("type", "button").attr("aria-label", "Role").children(Select.Value(h))
          ),
          Select.Content(h).children(
            Select.List(h).children(
              ...OPTIONS.map((option) =>
                Select.Item(h).value(option.value).children(option.label)
              )
            )
          )
        )
    ),
})

export { Definition as SelectTile }
