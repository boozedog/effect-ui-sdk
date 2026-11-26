// Shared page chrome. Both views are the same document, so the nav is two
// anchors plus a link that toggles the DaisyUI adapter. In-site links are
// query strings, which keep the Pages base path. The repository link is
// absolute and does not use `import.meta.env.BASE_URL`.
import type { Html } from "@effect/ui/html"
import { href, styleHref, type Query, type ViewName } from "./query"

export const REPO_URL = "https://github.com/boozedog/effect-ui-sdk"

const viewLink = <Msg>(
  h: Html.H<Msg>,
  name: ViewName,
  label: string,
  current: ViewName,
  query: Pick<Query, "only" | "style" | "theme">
) =>
  h.a
    .attr("href", href(name, query))
    .attr("aria-current", name === current ? "page" : "false")
    .class("chip", name === current && "chip-current")
    .children(label)

export const Masthead = <Msg>(h: Html.H<Msg>, view: ViewName, query: Pick<Query, "only" | "style" | "theme">) =>
  h.header.class("masthead").children(
    h.h1.children("Effect UI SDK bindings"),
    h.p.class("lede").children(
      view === "sink"
        ? "One tile per UI SDK entry. The first batch is a live Effect UI round-trip. Every other entry is a gap: its name, how many tags it has, and a link to that entry in the catalog."
        : "Every UI SDK web component as a typed Effect UI Html.customElement binding. This view is the generated catalog. The kitchen sink holds the live tiles."
    ),
    h.p.children(
      h.a.attr("href", REPO_URL).children("github.com/boozedog/effect-ui-sdk")
    ),
    h.nav.attr("aria-label", "Views").class("view-nav").children(
      viewLink(h, "catalog", "Catalog", view, query),
      viewLink(h, "sink", "Kitchen Sink", view, query),
      h.a
        .attr("href", styleHref(view, query))
        .class("chip")
        .children(query.style === "daisy" ? "UISDK theme" : "Daisy")
    )
  )

export const Foot = <Msg>(h: Html.H<Msg>) =>
  h.footer.class("foot").children(
    h.p.children(
      "Properties are JavaScript properties, written only when the value changed. Events decode to plain data, so nothing here calls preventDefault."
    )
  )
