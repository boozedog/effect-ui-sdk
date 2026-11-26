// Root declares `action` with an empty detail and no `valuechange`. Item
// declares `select`, also with an empty detail, so the chosen value is the
// item's own `value`, recorded from the handler that item owns.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Menu from "@boozedog/effect-ui-sdk/menu"
import { reported, tile } from "./shell"

const ITEMS = ["rename", "duplicate", "archive"] as const

const Message = UiSchema.TaggedEnum({
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
  Chose: {
    value: Schema.String,
  },
})

const Model = Schema.Struct({
  open: Schema.Boolean,
  chosen: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkMenu",
  model: Model,
  message: Message,
}).make({
  init: () => ({ open: false, chosen: "", reason: "", source: "" }),
  update: {
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
    Chose: ($, { value }) => $.evolve({ chosen: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "menu",
      "The menu binding has no valuechange. Each item's select event records that item's value. openchange still reports whether the menu is open.",
      `open ${model.open}; chose ${model.chosen === "" ? "(none)" : model.chosen}; ${reported(model.reason, model.source)}`,
      Menu.Root(h)
        .open(model.open)
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Menu.Trigger(h).children(h.button.attr("type", "button").children("Actions")),
          Menu.Content(h).children(
            ...ITEMS.map((item) =>
              Menu.Item(h)
                .value(item)
                .on("select", () => Message.Chose({ value: item }))
                .children(item)
            )
          )
        )
    ),
})

export { Definition as MenuTile }
