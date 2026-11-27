// One tile per catalog entry. Live tiles are child components, so this page
// does not own their Models and does not listen for their events.
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { entries } from "@boozedog/effect-ui-sdk/catalog"
import { Foot, Masthead } from "../chrome"
import { matches, PageProps } from "../query"
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
  props: PageProps,
  model: Schema.Struct({}),
  message: Schema.Never,
}).make({
  init: () => ({}),
  update: ($) => $,
  view: (h) => {
    const groups = entries.filter((group) => matches(group, h.props.only))
    const tile = { daisy: h.props.style === "daisy" }
    return h.div.class("page").children(
      Masthead(h, "sink", h.props),
      h.main.class("sink").children(
        ...groups.map((group) => {
          switch (group.entry) {
            case "toggle":
              return ToggleTile(h, { key: "toggle", props: tile })
            case "dialog":
              return DialogTile(h, { key: "dialog", props: tile })
            case "tabs":
              return TabsTile(h, { key: "tabs", props: tile })
            case "button":
              return ButtonTile(h, { key: "button", props: tile })
            case "checkbox":
              return CheckboxTile(h, { key: "checkbox", props: tile })
            case "switch":
              return SwitchTile(h, { key: "switch", props: tile })
            case "slider":
              return SliderTile(h, { key: "slider", props: tile })
            case "accordion":
              return AccordionTile(h, { key: "accordion", props: tile })
            case "collapsible":
              return CollapsibleTile(h, { key: "collapsible", props: tile })
            case "popover":
              return PopoverTile(h, { key: "popover", props: tile })
            case "tooltip":
              return TooltipTile(h, { key: "tooltip", props: tile })
            case "select":
              return SelectTile(h, { key: "select", props: tile })
            case "menu":
              return MenuTile(h, { key: "menu", props: tile })
            default:
              return gap(h, group, h.props)
          }
        })
      ),
      Foot(h)
    )
  },
})

export { Definition as SinkPage }
