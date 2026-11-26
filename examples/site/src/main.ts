import "./site.css"
import { Effect, Layer } from "effect"
import { BrowserHost } from "@effect/ui/html"
import { DevTools } from "@effect/ui-devtools"
import { CatalogPage } from "./app"
import { parseQuery } from "./query"
import { SinkPage } from "./sink/page"

// `?view=catalog` (the default) and `?view=sink` are the two pages. `?only=`
// filters either one. Both are query strings, so the site needs no router
// and GitHub Pages needs no 404 fallback: every URL is still `index.html`.
// The inspector is the overlay only: no Vite plugin, and WebMCP dispatch stays off.
const { view, only } = parseQuery(window.location.search)
const Page = view === "sink" ? SinkPage : CatalogPage

const Main = BrowserHost.mount(Page, { only }, document.getElementById("app")!).pipe(
  Layer.provide(DevTools.layer({ position: "BottomRight" }))
)

Layer.launch(Main).pipe(Effect.runFork)
