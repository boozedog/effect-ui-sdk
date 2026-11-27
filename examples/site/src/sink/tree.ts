// Selection and expansion are separate controlled properties: value is one
// string in mode "single", expanded is the open branches' values, and action
// carries { value } for the item that ran. The nested markup names the
// hierarchy: a group inside an item makes it a branch.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Tree from "@boozedog/effect-ui-sdk/tree"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedExpanded: {
    expanded: Schema.Array(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  Ran: {
    value: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  expanded: Schema.Array(Schema.String),
  ran: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const valueOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkTree",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({
    value: "src/index.ts",
    expanded: ["src"],
    ran: "",
    reason: "",
    source: "",
  }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedExpanded: ($, { expanded, reason, source }) =>
      $.evolve({ expanded: expanded.slice(), reason, source }),
    Ran: ($, { value }) => $.evolve({ ran: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "tree",
      "value is the selected item and expanded is the open branches. They are separate, so opening a folder does not change the selection.",
      `value ${model.value ?? "(none)"}; expanded ${model.expanded.length === 0 ? "(none)" : model.expanded.join(", ")}; ran ${model.ran === "" ? "(none)" : model.ran}; ${reported(model.reason, model.source)}`,
      Tree.Root(h)
        .attr("aria-label", "Files")
        .mode("single")
        .value(model.value)
        .expanded(model.expanded)
        .on("valuechange", ({ value, reason, source }) => {
          const next = valueOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .on("expandedchange", ({ value, reason, source }) =>
          Message.ChangedExpanded({ expanded: value, reason, source })
        )
        .on("action", ({ value }) => Message.Ran({ value }))
        .children(
          Tree.Item(h).value("src").children(
            Tree.ItemLabel(h).children(
              Tree.ItemIndicator(h).children("›"),
              h.span.children("src")
            ),
            Tree.Group(h).children(
              Tree.Item(h).value("src/index.ts").children(
                Tree.ItemLabel(h).children(h.span.children("index.ts"))
              ),
              Tree.Item(h).value("src/lib").children(
                Tree.ItemLabel(h).children(
                  Tree.ItemIndicator(h).children("›"),
                  h.span.children("lib")
                ),
                Tree.Group(h).children(
                  Tree.Item(h).value("src/lib/format.ts").children(
                    Tree.ItemLabel(h).children(h.span.children("format.ts"))
                  )
                )
              )
            )
          ),
          Tree.Item(h).value("package.json").children(
            Tree.ItemLabel(h).children(h.span.children("package.json"))
          )
        )
    ),
})

export { Definition as TreeTile }
