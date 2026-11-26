// Query-string routing only. GitHub Pages serves this app as one
// `index.html`, so a path would need a 404 fallback. `view` picks the page
// and `only` filters it. `style=daisy` opts into the DaisyUI adapter.
// `theme` is a daisy theme name and is applied only in that mode.
// Missing `view` is the catalog. Missing `style` keeps the UISDK look.
import type { Entry } from "@boozedog/effect-ui-sdk/catalog"

export type ViewName = "catalog" | "sink"
export type StyleName = "uisdk" | "daisy"
export type DaisyTheme = "light" | "dark" | "cupcake"

export type Query = {
  readonly view: ViewName
  readonly only: ReadonlyArray<string>
  readonly style: StyleName
  readonly theme: DaisyTheme | null
}

const THEMES: ReadonlyArray<DaisyTheme> = ["light", "dark", "cupcake"]

const themeOf = (value: string | null): DaisyTheme | null =>
  value !== null && (THEMES as ReadonlyArray<string>).includes(value) ? (value as DaisyTheme) : null

export const parseQuery = (search: string): Query => {
  const params = new URLSearchParams(search)
  const only =
    params
      .get("only")
      ?.split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value !== "") ?? []
  return {
    view: params.get("view") === "sink" ? "sink" : "catalog",
    only,
    style: params.get("style") === "daisy" ? "daisy" : "uisdk",
    theme: themeOf(params.get("theme")),
  }
}

/** A link that keeps the current filter, style, and daisy theme. Catalog is explicit so the nav never drops `view`. */
export const href = (view: ViewName, query: Pick<Query, "only" | "style" | "theme">): string => {
  const params = new URLSearchParams()
  params.set("view", view)
  if (query.only.length > 0) params.set("only", query.only.join(","))
  if (query.style === "daisy") params.set("style", "daisy")
  if (query.theme !== null) params.set("theme", query.theme)
  return `?${params.toString()}`
}

/** Toggles `style` and keeps `view` and `only` (and a daisy theme name, if one was set). */
export const styleHref = (view: ViewName, query: Pick<Query, "only" | "style" | "theme">): string =>
  href(view, {
    only: query.only,
    style: query.style === "daisy" ? "uisdk" : "daisy",
    theme: query.theme,
  })

/** Same match the catalog uses: entry name, namespace, or any tag. */
export const matches = (group: Entry, only: ReadonlyArray<string>): boolean =>
  only.length === 0 ||
  only.includes(group.entry) ||
  only.includes(group.namespace.toLowerCase()) ||
  group.tags.some((tag) => only.includes(tag.tag.toLowerCase()))
