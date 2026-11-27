// `value` and `query` are separate controlled properties. Options are
// ui-combobox-item children, and the value is narrowed to a string or null
// before it is stored.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Combobox from "@boozedog/effect-ui-sdk/combobox"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const FRAMEWORKS = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "astro", label: "Astro" },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedQuery: {
    query: Schema.String,
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
  query: Schema.String,
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const choiceOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkCombobox",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: null, query: "", open: false, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedQuery: ($, { query, reason, source }) => $.evolve({ query, reason, source }),
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "combobox",
      "value is the chosen option and query is the text being typed. They are separate properties, so a dismissed query does not change the value.",
      `value ${model.value ?? "(none)"}; query ${model.query === "" ? "(empty)" : `"${model.query}"`}; open ${model.open}; ${reported(model.reason, model.source)}`,
      Combobox.Root(h)
        .value(model.value)
        .query(model.query)
        .open(model.open)
        .on("valuechange", ({ value, reason, source }) => {
          const next = choiceOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .on("querychange", ({ value, reason, source }) =>
          Message.ChangedQuery({ query: value, reason, source })
        )
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          h.div.attr("data-slot", "row").children(
            Combobox.Input(h).children(
              h.input
                .attr("aria-label", "Framework")
                .attr("placeholder", "Select a framework")
            ),
            // The trigger is the field's suffix button, and the theme draws
            // its chevron, so it stays an empty button rather than taking the
            // action button face.
            Combobox.Trigger(h).children(
              h.button.attr("type", "button").attr("aria-label", "Show frameworks")
            )
          ),
          Combobox.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              Combobox.Empty(h).children("No frameworks found."),
              Combobox.List(h).children(
                ...FRAMEWORKS.map((framework) =>
                  Combobox.Item(h)
                    .value(framework.value)
                    .label(framework.label)
                    .class(face(h.props.daisy, classes.item))
                    // The theme draws the check for the indicator that has
                    // no icon of its own.
                    .children(
                      framework.label,
                      Combobox.ItemIndicator(h)
                    )
                )
              )
            )
        )
    ),
})

export { Definition as ComboboxTile }
