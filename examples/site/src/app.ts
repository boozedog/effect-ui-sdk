// The catalog page's one Effect UI component. It holds the three hand-built
// composites at the top, each a Model -> property -> event round-trip, and the
// generated list of every binding below.
//
// The composites show the two halves of the contract:
//
//   Model -> property   `.pressed(model.pressed)`, `.open(model.open)`,
//                       `.value(model.tab)`
//   event -> Model      `.on("pressedchange", ({ value, reason, source }) =>
//                       Message...({ ... }))`
//
// A change event carries the value the element already moved to, so the update
// accepts it. No view can `preventDefault` here: a decoded detail is plain
// data, and the element has already changed by the time the handler runs.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Dialog from "@boozedog/effect-ui-sdk/dialog"
import * as Tabs from "@boozedog/effect-ui-sdk/tabs"
import * as Toggle from "@boozedog/effect-ui-sdk/toggle"
import { entries, uiSdkVersion, type Binding, type Entry } from "@boozedog/effect-ui-sdk/catalog"

const Message = UiSchema.TaggedEnum({
  ChangedPressed: {
    pressed: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedTab: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  // Toggle: the Model holds what the element reports.
  pressed: Schema.Boolean,
  pressedReason: Schema.String,
  pressedSource: Schema.String,
  // Dialog: `open` is the element's own property too, not an `<input>`'s
  // controlled `open`. The Model follows it.
  open: Schema.Boolean,
  openReason: Schema.String,
  openSource: Schema.String,
  // Tabs: `value` is `ui-tabs`'s selected tab.
  tab: Schema.String,
  tabReason: Schema.String,
  tabSource: Schema.String,
})

interface Props {
  /** The `?only=` filter: entry names or tags, lowercased. Empty means all. */
  readonly only: ReadonlyArray<string>
}

const TAB_IDS = ["overview", "properties", "events"] as const

const describeEvent = (reason: string, source: string): string =>
  reason === "" ? "no event yet" : `reason "${reason}", source "${source}"`

const filtered = (groups: ReadonlyArray<Entry>, only: ReadonlyArray<string>): ReadonlyArray<Entry> =>
  only.length === 0
    ? groups
    : groups.filter(
        (group) =>
          only.includes(group.entry) ||
          only.includes(group.namespace.toLowerCase()) ||
          group.tags.some((tag) => only.includes(tag.tag.toLowerCase()))
      )

const tagsOf = (group: Entry, only: ReadonlyArray<string>): ReadonlyArray<Binding> =>
  only.length === 0 || only.includes(group.entry) || only.includes(group.namespace.toLowerCase())
    ? group.tags
    : group.tags.filter((tag) => only.includes(tag.tag.toLowerCase()))

// The value a binding is reached through, `Toggle.Root` and so on.
const pathOf = (row: Binding): string => `${row.namespace}.${row.name}`

const ToggleSection = (h: Html.H<typeof Message.Type>, model: typeof Model.Type) =>
  h.section.class("panel").children(
    h.h2.children("Toggle"),
    h.p.class("lede").children(
      "pressed is a plain JavaScript property on the element. The click changes the element first, then pressedchange carries the new value back, and the Model keeps it."
    ),
    Toggle.Root(h)
      .class("toggle")
      .pressed(model.pressed)
      // The handler gets the decoded detail, never the CustomEvent.
      .on("pressedchange", ({ value, reason, source }) =>
        Message.ChangedPressed({ pressed: value, reason, source })
      )
      .children(h.button.attr("type", "button").children(model.pressed ? "Pinned" : "Pin")),
    h.dl.class("facts").children(
      h.dt.children("Model.pressed"),
      h.dd.class("mono").children(String(model.pressed)),
      h.dt.children("last pressedchange"),
      h.dd.children(describeEvent(model.pressedReason, model.pressedSource))
    )
  )

const DialogSection = (h: Html.H<typeof Message.Type>, model: typeof Model.Type) =>
  h.section.class("panel").children(
    h.h2.children("Dialog"),
    h.p.class("lede").children(
      "open is the element's own property, not an <input>'s controlled open. The trigger asks the dialog to open and the dialog asks to close on Escape or a press outside; each request comes back as openchange, and the Model keeps the value the element reports."
    ),
    Dialog.Root(h)
      .class("dialog")
      .open(model.open)
      .on("openchange", ({ value, reason, source }) =>
        Message.ChangedOpen({ open: value, reason, source })
      )
      .children(
        Dialog.Trigger(h).children(
          h.button.attr("type", "button").children(model.open ? "Dialog is open" : "Open dialog")
        ),
        Dialog.Content(h).children(
          Dialog.Title(h).children("A bound dialog"),
          h.p.children(
            "Focus moves inside, the page behind is inert, and Escape asks the dialog to close. The request reaches the Model as openchange."
          ),
          Dialog.Close(h).children(h.button.attr("type", "button").children("Close"))
        )
      ),
    h.dl.class("facts").children(
      h.dt.children("Model.open"),
      h.dd.class("mono").children(String(model.open)),
      h.dt.children("last openchange"),
      h.dd.children(describeEvent(model.openReason, model.openSource))
    )
  )

const TabsSection = (h: Html.H<typeof Message.Type>, model: typeof Model.Type) =>
  h.section.class("panel").children(
    h.h2.children("Tabs"),
    h.p.class("lede").children(
      "value is the selected tab. Arrow keys and clicks move it, valuechange reports the tab the element moved to, and the Model follows."
    ),
    Tabs.Root(h)
      .class("tabs")
      .value(model.tab)
      .on("valuechange", ({ value, reason, source }) =>
        Message.ChangedTab({ value, reason, source })
      )
      .children(
        Tabs.List(h)
          .attr("aria-label", "A bound tabs example")
          .children(
            ...TAB_IDS.map((id) =>
              Tabs.Tab(h)
                .value(id)
                .children(h.button.attr("type", "button").children(id))
            )
          ),
        ...TAB_IDS.map((id) =>
          Tabs.Panel(h)
            .value(id)
            .children(h.p.children(`The ${id} panel. The Model says "${model.tab}".`))
        )
      ),
    h.dl.class("facts").children(
      h.dt.children("Model.tab"),
      h.dd.class("mono").children(model.tab),
      h.dt.children("last valuechange"),
      h.dd.children(describeEvent(model.tabReason, model.tabSource))
    )
  )

const CatalogSection = (h: Html.H<typeof Message.Type>, props: Props) => {
  const groups = filtered(entries, props.only)
  const total = groups.reduce((count, group) => count + tagsOf(group, props.only).length, 0)

  return h.section.class("panel catalog").children(
    h.h2.children("Catalog"),
    h.p.class("lede").children(
      `All ${entries.reduce((count, group) => count + group.tags.length, 0)} tags from @ui-sdk/web ${uiSdkVersion}, one binding each, grouped by the entry that registers them. Import \`@boozedog/effect-ui-sdk/<entry>\` to register one group.`
    ),
    h.nav
      .attr("aria-label", "Filter the catalog by entry")
      .class("filters")
      .children(
        h.a.attr("href", "./").class("chip", props.only.length === 0 && "chip-current").children("all"),
        ...entries.map((group) =>
          h.a
            .attr("href", `?only=${group.entry}`)
            .class("chip", props.only.includes(group.entry) && "chip-current")
            .children(group.entry)
        )
      ),
    h.p.class("count").children(
      `${total} binding${total === 1 ? "" : "s"} in ${groups.length} entr${groups.length === 1 ? "y" : "ies"}.`
    ),
    ...groups.map((group) => {
      const tags = tagsOf(group, props.only)
      return h.section.class("entry").children(
        h.h3.children(
          h.a.attr("href", `?only=${group.entry}`).children(group.namespace),
          h.span.class("entry-path mono").children(`@boozedog/effect-ui-sdk/${group.entry}`)
        ),
        h.ul.class("tags").children(
          ...tags.map((row) =>
            h.li.class("tag").children(
              h.span.class("tag-name").children(row.tag),
              h.span.class("tag-binding mono").children(pathOf(row)),
              h.span.class("tag-detail").children(
                `${row.properties.length} propert${row.properties.length === 1 ? "y" : "ies"}, ${row.events.length} event${row.events.length === 1 ? "" : "s"}`
              )
            )
          )
        )
      )
    })
  )
}

const Definition = Html.component({
  name: "CatalogPage",
  props: Schema.Struct({ only: Schema.Array(Schema.String) }),
  model: Model,
  message: Message,
}).make({
  init: () => ({
    pressed: false,
    pressedReason: "",
    pressedSource: "",
    open: false,
    openReason: "",
    openSource: "",
    tab: "overview",
    tabReason: "",
    tabSource: "",
  }),
  update: {
    ChangedPressed: ($, { pressed, reason, source }) =>
      $.evolve({ pressed, pressedReason: reason, pressedSource: source }),
    ChangedOpen: ($, { open, reason, source }) =>
      $.evolve({ open, openReason: reason, openSource: source }),
    // The element reports `null` when nothing is selected. The Model keeps a
    // string, so it ignores that report rather than storing a value no tab has.
    ChangedTab: ($, { value, reason, source }) =>
      $.evolve({
        tab: value ?? $.model.tab,
        tabReason: reason,
        tabSource: source,
      }),
  },
  view: (h, model) =>
    h.div.class("page").children(
      h.header.class("masthead").children(
        h.h1.children("Effect UI SDK bindings"),
        h.p.class("lede").children(
          "Every UI SDK web component as a typed Effect UI Html.customElement binding. This page is one BrowserHost.mount: three round-trips at the top, and the generated catalog below."
        )
      ),
      h.main.children(
        h.div.class("demos").children(
          ToggleSection(h, model),
          DialogSection(h, model),
          TabsSection(h, model)
        ),
        CatalogSection(h, h.props)
      ),
      h.footer.class("foot").children(
        h.p.children(
          "Properties are JavaScript properties, written only when the value changed. Events decode to plain data, so nothing here calls preventDefault."
        )
      )
    ),
})

export { Definition as CatalogPage }
