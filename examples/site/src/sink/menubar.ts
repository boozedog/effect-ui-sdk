// The menubar adds nothing to a Menu but the shared tab stop: each menu keeps
// its own `open` and its own `action` event, so each is bound separately.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Menu from "@boozedog/effect-ui-sdk/menu"
import * as Menubar from "@boozedog/effect-ui-sdk/menubar"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const MENUS = [
  { key: "file", label: "File", items: ["new", "open", "save"] },
  { key: "edit", label: "Edit", items: ["undo", "redo", "find"] },
] as const

const Message = UiSchema.TaggedEnum({
  ChangedOpen: {
    menu: Schema.String,
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
  Chose: {
    value: Schema.String,
  },
})

const Model = Schema.Struct({
  file: Schema.Boolean,
  edit: Schema.Boolean,
  chosen: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkMenubar",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ file: false, edit: false, chosen: "", reason: "", source: "" }),
  update: {
    ChangedOpen: ($, { menu, open, reason, source }) =>
      menu === "file"
        ? $.evolve({ file: open, reason, source })
        : $.evolve({ edit: open, reason, source }),
    Chose: ($, { value }) => $.evolve({ chosen: value }),
  },
  view: (h, model) =>
    tile(
      h,
      "menubar",
      "The menubar connects a few menus into one tab stop, and arrow keys move between them. Each menu keeps its own open, and its action event still carries the chosen item.",
      `open ${model.file ? "file" : ""}${model.edit ? " edit" : ""}${
        model.file || model.edit ? "" : "(none)"
      }; chose ${model.chosen === "" ? "(none)" : model.chosen}; ${reported(model.reason, model.source)}`,
      Menubar.Root(h).children(
        ...MENUS.map((menu) =>
          Menu.Root(h)
            .open(menu.key === "file" ? model.file : model.edit)
            .on("openchange", ({ value, reason, source }) =>
              Message.ChangedOpen({ menu: menu.key, open: value, reason, source })
            )
            .on("action", ({ value }) => Message.Chose({ value }))
            .children(
              Menu.Trigger(h).children(
                h.button
                  .attr("type", "button")
                  .class(face(h.props.daisy, classes.button))
                  .children(menu.label)
              ),
              Menu.Content(h)
                .class(face(h.props.daisy, classes.popup))
                .children(
                  ...menu.items.map((item) =>
                    Menu.Item(h)
                      .value(item)
                      .class(face(h.props.daisy, classes.item))
                      .children(item)
                  )
                )
            )
        )
      )
    ),
})

export { Definition as MenubarTile }
