// `value` is the open item ids. The array is replaced only in update.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Accordion from "@boozedog/effect-ui-sdk/accordion"
import { reported, tile } from "./shell"

const ITEMS = [
  { value: "shipping", label: "Shipping", body: "Standard, express, and overnight." },
  { value: "returns", label: "Returns", body: "Unused items within 30 days." },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.Array(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.Array(Schema.String),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkAccordion",
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: [], reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) =>
      $.evolve({ value: value.slice(), reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "accordion",
      "value is the open items. A click on a trigger changes the array, and valuechange reports what the element opened.",
      `open ${model.value.length === 0 ? "(none)" : model.value.join(", ")}; ${reported(model.reason, model.source)}`,
      Accordion.Root(h)
        .value(model.value)
        .collapsible(true)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          ...ITEMS.map((item) =>
            Accordion.Item(h)
              .value(item.value)
              .children(
                Accordion.Header(h).children(
                  Accordion.Trigger(h).children(
                    h.button.attr("type", "button").children(item.label)
                  )
                ),
                Accordion.Panel(h).children(h.p.children(item.body))
              )
          )
        )
    ),
})

export { Definition as AccordionTile }
