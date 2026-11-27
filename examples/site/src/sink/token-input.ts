// value mixes text and tokens. The editor renders the content itself, so
// without a <template> each token shows its label. The starting value is a
// module constant, and init copies it so the element never holds the constant.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as TokenInput from "@boozedog/effect-ui-sdk/token-input"
import { Props } from "./face"
import { reported, tile } from "./shell"

const INITIAL_VALUE = [
  { type: "mention", value: "ines", label: "Inès Moreau" },
  " can you review this?",
]

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.Array(Schema.Unknown),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.Array(Schema.Unknown),
  reason: Schema.String,
  source: Schema.String,
})

const textOf = (value: readonly unknown[]): string =>
  value
    .map((segment) =>
      typeof segment === "string"
        ? segment
        : String((segment as { label?: unknown }).label ?? "")
    )
    .join("")

const initialValue = () =>
  INITIAL_VALUE.map((segment) =>
    typeof segment === "string" ? segment : { ...segment }
  )

const Definition = Html.component({
  name: "SinkTokenInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: initialValue(), reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) =>
      $.evolve({ value: value.slice(), reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "token-input",
      "The value is text and tokens together. Each token moves, deletes and copies as one piece, and the editor keeps its own undo history.",
      `value ${textOf(model.value) === "" ? "(empty)" : `"${textOf(model.value)}"`}; ${reported(model.reason, model.source)}`,
      TokenInput.Root(h)
        .value(model.value)
        .on("valuechange", ({ value, reason, source }) =>
          Array.isArray(value)
            ? Message.ChangedValue({ value, reason, source })
            : undefined
        )
        .children(
          TokenInput.Editor(h)
            .attr("aria-label", "Message")
            .placeholder("Type a message")
        )
    ),
})

export { Definition as TokenInputTile }
