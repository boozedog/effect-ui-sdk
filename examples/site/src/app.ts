// The catalog page. It lists every generated binding and holds no tile state.
// The live round-trips live on the kitchen sink, one child component each.
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { entries, uiSdkVersion, type Binding, type Entry } from "@boozedog/effect-ui-sdk/catalog"
import { Foot, Masthead } from "./chrome"
import { href, matches } from "./query"

const tagsOf = (group: Entry, only: ReadonlyArray<string>): ReadonlyArray<Binding> =>
  only.length === 0 || only.includes(group.entry) || only.includes(group.namespace.toLowerCase())
    ? group.tags
    : group.tags.filter((tag) => only.includes(tag.tag.toLowerCase()))

const pathOf = (row: Binding): string => `${row.namespace}.${row.name}`

const CatalogSection = (h: Html.H<never>, only: ReadonlyArray<string>) => {
  const groups = entries.filter((group) => matches(group, only))
  const total = groups.reduce((count, group) => count + tagsOf(group, only).length, 0)

  return h.section.class("panel catalog").children(
    h.h2.children("Catalog"),
    h.p.class("lede").children(
      `All ${entries.reduce((count, group) => count + group.tags.length, 0)} tags from @ui-sdk/web ${uiSdkVersion}, one binding each, grouped by the entry that registers them. Import \`@boozedog/effect-ui-sdk/<entry>\` to register one group.`
    ),
    h.nav
      .attr("aria-label", "Filter the catalog by entry")
      .class("filters")
      .children(
        h.a.attr("href", href("catalog", [])).class("chip", only.length === 0 && "chip-current").children("all"),
        ...entries.map((group) =>
          h.a
            .attr("href", href("catalog", [group.entry]))
            .class("chip", only.includes(group.entry) && "chip-current")
            .children(group.entry)
        )
      ),
    h.p.class("count").children(
      `${total} binding${total === 1 ? "" : "s"} in ${groups.length} entr${groups.length === 1 ? "y" : "ies"}.`
    ),
    ...groups.map((group) => {
      const tags = tagsOf(group, only)
      return h.section.class("entry").children(
        h.h3.children(
          h.a.attr("href", href("catalog", [group.entry])).children(group.namespace),
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
  model: Schema.Struct({}),
  message: Schema.Never,
}).make({
  init: () => ({}),
  update: ($) => $,
  view: (h) =>
    h.div.class("page").children(
      Masthead(h, "catalog", h.props.only),
      h.main.children(CatalogSection(h, h.props.only)),
      Foot(h)
    ),
})

export { Definition as CatalogPage }
