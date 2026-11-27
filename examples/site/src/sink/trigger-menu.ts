// The triggers are a property, not children: each names the text that starts a
// match and the items it offers. The popup starts closed, and opens at the
// caret once someone types the trigger.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as TriggerMenu from "@boozedog/effect-ui-sdk/trigger-menu"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const TRIGGERS = [
  {
    char: "@",
    type: "mention",
    items: [
      { value: "hollis", label: "Hollis Grant" },
      { value: "ines", label: "Inès Moreau" },
      { value: "kofi", label: "Kofi Mensah" },
    ],
  },
]

const Message = UiSchema.TaggedEnum({
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedQuery: {
    query: Schema.String,
    trigger: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  Chose: {
    value: Schema.String,
  },
})

const Model = Schema.Struct({
  open: Schema.Boolean,
  query: Schema.String,
  trigger: Schema.String,
  chose: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

// `itemselect` is declared as `Schema.Unknown`, so the handler reads the
// detail itself rather than a decoded payload.
const itemValueOf = (payload: unknown): string => {
  const value = (payload as { value?: unknown } | null)?.value
  return typeof value === "string" ? value : ""
}

const Definition = Html.component({
  name: "SinkTriggerMenu",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ open: false, query: "", trigger: "", chose: "", reason: "", source: "" }),
  update: {
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
    ChangedQuery: ($, { query, trigger, reason, source }) =>
      $.evolve({ query, trigger, reason, source }),
    Chose: ($, { value }) => $.evolve({ chose: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "trigger-menu",
      "Typing a trigger such as @ opens the list at the caret. querychange reports the text after it, and itemselect names what was chosen.",
      `open ${model.open}${model.trigger === "" ? "" : ` on ${model.trigger}`}; query ${model.query === "" ? "(empty)" : `"${model.query}"`}; chose ${model.chose === "" ? "(none)" : model.chose}; ${reported(model.reason, model.source)}`,
      TriggerMenu.Root(h)
        .open(model.open)
        .triggers(TRIGGERS)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .on("querychange", ({ value, reason, source, trigger }) =>
          Message.ChangedQuery({ query: value, trigger, reason, source })
        )
        .on("itemselect", (payload) => Message.Chose({ value: itemValueOf(payload) }))
        .children(
          TriggerMenu.Input(h).children(
            h.textarea
              .attr("aria-label", "Message")
              .attr("placeholder", "Type @ to mention someone")
          ),
          TriggerMenu.Status(h),
          TriggerMenu.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              TriggerMenu.Empty(h).children("No one found."),
              TriggerMenu.List(h).children(
                ...TRIGGERS[0]!.items.map((person) =>
                  TriggerMenu.Item(h)
                    .value(person.value)
                    .label(person.label)
                    .class(face(h.props.daisy, classes.item))
                    .children(person.label)
                )
              )
            )
        )
    ),
})

export { Definition as TriggerMenuTile }
