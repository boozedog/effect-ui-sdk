// Query-string routing only. GitHub Pages serves this app as one
// `index.html`, so a path would need a 404 fallback. `view` picks the page
// and `only` filters it. Missing `view` is the catalog.
import type { Entry } from "@boozedog/effect-ui-sdk/catalog"

export type ViewName = "catalog" | "sink"

export const parseQuery = (search: string): { readonly view: ViewName; readonly only: ReadonlyArray<string> } => {
  const params = new URLSearchParams(search)
  const only =
    params
      .get("only")
      ?.split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value !== "") ?? []
  return { view: params.get("view") === "sink" ? "sink" : "catalog", only }
}

/** A link that keeps the current filter. Catalog is explicit so the nav never drops `view`. */
export const href = (view: ViewName, only: ReadonlyArray<string>): string => {
  const params = new URLSearchParams()
  params.set("view", view)
  if (only.length > 0) params.set("only", only.join(","))
  return `?${params.toString()}`
}

/** Same match the catalog uses: entry name, namespace, or any tag. */
export const matches = (group: Entry, only: ReadonlyArray<string>): boolean =>
  only.length === 0 ||
  only.includes(group.entry) ||
  only.includes(group.namespace.toLowerCase()) ||
  group.tags.some((tag) => only.includes(tag.tag.toLowerCase()))
