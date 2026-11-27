// `value` is the selected option: a string or null in single selection. The
// indicator shows its content on the selected option only.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Listbox from "@boozedog/effect-ui-sdk/listbox"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const TOPICS = [
  { value: "comments", label: "Comments" },
  { value: "mentions", label: "Mentions" },
  { value: "billing", label: "Billing" },
] as const

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

const choiceOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkListbox",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: null, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "listbox",
      "value is the selected option. It stays in view, so the whole choice is visible instead of waiting for a popup to open.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      Listbox.Root(h)
        .attr("aria-label", "Email me about")
        .value(model.value)
        .on("valuechange", ({ value, reason, source }) => {
          const next = choiceOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .children(
          ...TOPICS.map((topic) =>
            Listbox.Item(h)
              .value(topic.value)
              .class(face(h.props.daisy, classes.item))
              // The theme draws the check for the indicator that has no icon
              // of its own.
              .children(
                topic.label,
                Listbox.ItemIndicator(h)
              )
          )
        )
    ),
})

export { Definition as ListboxTile }
