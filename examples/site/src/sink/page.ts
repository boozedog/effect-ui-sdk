// One tile per catalog entry. Live tiles are child components, so this page
// does not own their Models and does not listen for their events.
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { entries } from "@boozedog/effect-ui-sdk/catalog"
import { Foot, Masthead } from "../chrome"
import { matches, PageProps } from "../query"
import { AccordionTile } from "./accordion"
import { AlertDialogTile } from "./alert-dialog"
import { AutocompleteTile } from "./autocomplete"
import { AvatarTile } from "./avatar"
import { ButtonTile } from "./button"
import { CalendarTile } from "./calendar"
import { CarouselTile } from "./carousel"
import { CheckboxTile } from "./checkbox"
import { CollapsibleTile } from "./collapsible"
import { ColorPickerTile } from "./color-picker"
import { ComboboxTile } from "./combobox"
import { CommandTile } from "./command"
import { DateInputTile } from "./date-input"
import { DatePickerTile } from "./date-picker"
import { DialogTile } from "./dialog"
import { DrawerTile } from "./drawer"
import { FieldTile } from "./field"
import { FileInputTile } from "./file-input"
import { HoverCardTile } from "./hover-card"
import { ImageCropperTile } from "./image-cropper"
import { InputTile } from "./input"
import { LabelTile } from "./label"
import { ListboxTile } from "./listbox"
import { MenuTile } from "./menu"
import { MenubarTile } from "./menubar"
import { MeterTile } from "./meter"
import { NavigationMenuTile } from "./navigation-menu"
import { NumberInputTile } from "./number-input"
import { OTPInputTile } from "./otp-input"
import { OverlaysTile } from "./overlays"
import { PaginationTile } from "./pagination"
import { PasswordInputTile } from "./password-input"
import { PopoverTile } from "./popover"
import { PreferencesTile } from "./preferences"
import { ProgressTile } from "./progress"
import { RadioTile } from "./radio"
import { RatingTile } from "./rating"
import { ResizableTile } from "./resizable"
import { ScrollAreaTile } from "./scroll-area"
import { SegmentedControlTile } from "./segmented-control"
import { SelectTile } from "./select"
import { SeparatorTile } from "./separator"
import { gap } from "./shell"
import { SliderTile } from "./slider"
import { SwitchTile } from "./switch"
import { TabsTile } from "./tabs"
import { TextareaTile } from "./textarea"
import { TimeInputTile } from "./time-input"
import { TimelineTile } from "./timeline"
import { ToastTile } from "./toast"
import { ToggleTile } from "./toggle"
import { TokenInputTile } from "./token-input"
import { ToolbarTile } from "./toolbar"
import { TooltipTile } from "./tooltip"
import { TreeTile } from "./tree"
import { TriggerMenuTile } from "./trigger-menu"
import { WaterfallTile } from "./waterfall"

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
            case "accordion":
              return AccordionTile(h, { key: "accordion", props: tile })
            case "alert-dialog":
              return AlertDialogTile(h, { key: "alert-dialog", props: tile })
            case "autocomplete":
              return AutocompleteTile(h, { key: "autocomplete", props: tile })
            case "avatar":
              return AvatarTile(h, { key: "avatar", props: tile })
            case "button":
              return ButtonTile(h, { key: "button", props: tile })
            case "calendar":
              return CalendarTile(h, { key: "calendar", props: tile })
            case "carousel":
              return CarouselTile(h, { key: "carousel", props: tile })
            case "checkbox":
              return CheckboxTile(h, { key: "checkbox", props: tile })
            case "collapsible":
              return CollapsibleTile(h, { key: "collapsible", props: tile })
            case "color-picker":
              return ColorPickerTile(h, { key: "color-picker", props: tile })
            case "combobox":
              return ComboboxTile(h, { key: "combobox", props: tile })
            case "command":
              return CommandTile(h, { key: "command", props: tile })
            case "date-input":
              return DateInputTile(h, { key: "date-input", props: tile })
            case "date-picker":
              return DatePickerTile(h, { key: "date-picker", props: tile })
            case "dialog":
              return DialogTile(h, { key: "dialog", props: tile })
            case "drawer":
              return DrawerTile(h, { key: "drawer", props: tile })
            case "field":
              return FieldTile(h, { key: "field", props: tile })
            case "file-input":
              return FileInputTile(h, { key: "file-input", props: tile })
            case "hover-card":
              return HoverCardTile(h, { key: "hover-card", props: tile })
            case "image-cropper":
              return ImageCropperTile(h, { key: "image-cropper", props: tile })
            case "input":
              return InputTile(h, { key: "input", props: tile })
            case "label":
              return LabelTile(h, { key: "label", props: tile })
            case "listbox":
              return ListboxTile(h, { key: "listbox", props: tile })
            case "menu":
              return MenuTile(h, { key: "menu", props: tile })
            case "menubar":
              return MenubarTile(h, { key: "menubar", props: tile })
            case "meter":
              return MeterTile(h, { key: "meter", props: tile })
            case "navigation-menu":
              return NavigationMenuTile(h, { key: "navigation-menu", props: tile })
            case "number-input":
              return NumberInputTile(h, { key: "number-input", props: tile })
            case "otp-input":
              return OTPInputTile(h, { key: "otp-input", props: tile })
            case "overlays":
              return OverlaysTile(h, { key: "overlays", props: tile })
            case "pagination":
              return PaginationTile(h, { key: "pagination", props: tile })
            case "password-input":
              return PasswordInputTile(h, { key: "password-input", props: tile })
            case "popover":
              return PopoverTile(h, { key: "popover", props: tile })
            case "preferences":
              return PreferencesTile(h, { key: "preferences", props: tile })
            case "progress":
              return ProgressTile(h, { key: "progress", props: tile })
            case "radio":
              return RadioTile(h, { key: "radio", props: tile })
            case "rating":
              return RatingTile(h, { key: "rating", props: tile })
            case "resizable":
              return ResizableTile(h, { key: "resizable", props: tile })
            case "scroll-area":
              return ScrollAreaTile(h, { key: "scroll-area", props: tile })
            case "segmented-control":
              return SegmentedControlTile(h, { key: "segmented-control", props: tile })
            case "select":
              return SelectTile(h, { key: "select", props: tile })
            case "separator":
              return SeparatorTile(h, { key: "separator", props: tile })
            case "slider":
              return SliderTile(h, { key: "slider", props: tile })
            case "switch":
              return SwitchTile(h, { key: "switch", props: tile })
            case "tabs":
              return TabsTile(h, { key: "tabs", props: tile })
            case "textarea":
              return TextareaTile(h, { key: "textarea", props: tile })
            case "time-input":
              return TimeInputTile(h, { key: "time-input", props: tile })
            case "timeline":
              return TimelineTile(h, { key: "timeline", props: tile })
            case "toast":
              return ToastTile(h, { key: "toast", props: tile })
            case "toggle":
              return ToggleTile(h, { key: "toggle", props: tile })
            case "token-input":
              return TokenInputTile(h, { key: "token-input", props: tile })
            case "toolbar":
              return ToolbarTile(h, { key: "toolbar", props: tile })
            case "tooltip":
              return TooltipTile(h, { key: "tooltip", props: tile })
            case "tree":
              return TreeTile(h, { key: "tree", props: tile })
            case "trigger-menu":
              return TriggerMenuTile(h, { key: "trigger-menu", props: tile })
            case "waterfall":
              return WaterfallTile(h, { key: "waterfall", props: tile })
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
