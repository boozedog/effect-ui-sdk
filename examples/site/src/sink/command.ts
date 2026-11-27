// The list stays open while someone searches. `query` is the search text and
// `action` carries `{ value }` for the command that ran.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Command from "@boozedog/effect-ui-sdk/command"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const COMMANDS = [
  { value: "calendar", label: "Calendar" },
  { value: "billing", label: "Billing" },
  { value: "settings", label: "Settings" },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedQuery: {
    query: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  Ran: {
    value: Schema.String,
  },
})

const Model = Schema.Struct({
  query: Schema.String,
  ran: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkCommand",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ query: "", ran: "", reason: "", source: "" }),
  update: {
    ChangedQuery: ($, { query, reason, source }) => $.evolve({ query, reason, source }),
    Ran: ($, { value }) => $.evolve({ ran: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "command",
      "query filters the commands. The action event carries the value of the command that ran, so the list can stay open while the search text changes.",
      `query ${model.query === "" ? "(empty)" : `"${model.query}"`}; ran ${model.ran === "" ? "(none)" : model.ran}; ${reported(model.reason, model.source)}`,
      Command.Root(h)
        .query(model.query)
        .on("querychange", ({ value, reason, source }) =>
          Message.ChangedQuery({ query: value, reason, source })
        )
        .on("action", ({ value }) => Message.Ran({ value }))
        .children(
          Command.Input(h).children(
            h.input
              .attr("aria-label", "Search commands")
              .attr("placeholder", "Type a command")
          ),
          Command.Empty(h).children("No results found."),
          Command.List(h).children(
            Command.Group(h).children(
              Command.GroupLabel(h).children("Suggestions"),
              ...COMMANDS.map((command) =>
                Command.Item(h)
                  .value(command.value)
                  .class(face(h.props.daisy, classes.item))
                  .children(h.span.children(command.label))
              )
            )
          )
        )
    ),
})

export { Definition as CommandTile }
