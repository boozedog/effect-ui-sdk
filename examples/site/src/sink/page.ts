// One tile per catalog entry. Live tiles are child components, so this page
// does not own their Models and does not listen for their events.
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { entries } from "@boozedog/effect-ui-sdk/catalog"
import { Foot, Masthead } from "../chrome"
import { matches } from "../query"
import { AccordionTile } from "./accordion"
import { ButtonTile } from "./button"
import { CheckboxTile } from "./checkbox"
import { CollapsibleTile } from "./collapsible"
import { DialogTile } from "./dialog"
import { MenuTile } from "./menu"
import { PopoverTile } from "./popover"
import { SelectTile } from "./select"
import { gap } from "./shell"
import { SliderTile } from "./slider"
import { SwitchTile } from "./switch"
import { TabsTile } from "./tabs"
import { ToggleTile } from "./toggle"
import { TooltipTile } from "./tooltip"

const Definition = Html.component({
  name: "SinkPage",
  props: Schema.Struct({ only: Schema.Array(Schema.String) }),
  model: Schema.Struct({}),
  message: Schema.Never,
}).make({
  init: () => ({}),
  update: ($) => $,
  view: (h) => {
    const groups = entries.filter((group) => matches(group, h.props.only))
    return h.div.class("page").children(
      Masthead(h, "sink", h.props.only),
      h.main.class("sink").children(
        ...groups.map((group) => {
          switch (group.entry) {
            case "toggle":
              return ToggleTile(h, { key: "toggle" })
            case "dialog":
              return DialogTile(h, { key: "dialog" })
            case "tabs":
              return TabsTile(h, { key: "tabs" })
            case "button":
              return ButtonTile(h, { key: "button" })
            case "checkbox":
              return CheckboxTile(h, { key: "checkbox" })
            case "switch":
              return SwitchTile(h, { key: "switch" })
            case "slider":
              return SliderTile(h, { key: "slider" })
            case "accordion":
              return AccordionTile(h, { key: "accordion" })
            case "collapsible":
              return CollapsibleTile(h, { key: "collapsible" })
            case "popover":
              return PopoverTile(h, { key: "popover" })
            case "tooltip":
              return TooltipTile(h, { key: "tooltip" })
            case "select":
              return SelectTile(h, { key: "select" })
            case "menu":
              return MenuTile(h, { key: "menu" })
            default:
              return gap(h, group)
          }
        })
      ),
      Foot(h)
    )
  },
})

export { Definition as SinkPage }
