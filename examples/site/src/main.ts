import "./site.css"
import { Effect, Layer } from "effect"
import { BrowserHost } from "@effect/ui/html"
import { DevTools } from "@effect/ui-devtools"
import { CatalogPage } from "./app"
import { parseQuery } from "./query"
import { SinkPage } from "./sink/page"

// `?view=catalog` (the default) and `?view=sink` are the two pages. `?only=`
// filters either one. `?style=daisy` opts into the DaisyUI adapter, and
// `?theme=` picks a daisy theme. All of them are query strings, so the site
// needs no router and GitHub Pages needs no 404 fallback: every URL is still
// `index.html`. The inspector is the overlay only: no Vite plugin, and WebMCP
// dispatch stays off.
//
// `site.css` is page layout. The component theme is a separate chunk, loaded
// before mount: `@ui-sdk/core/web.css` unless `style=daisy`, in which case
// `./daisy.css`. That wrapper imports the daisy package stylesheet and tells
// Tailwind to scan this app's source. The default page does not request the
// daisy chunk.
const query = parseQuery(window.location.search)
const Page = query.view === "sink" ? SinkPage : CatalogPage

if (query.style === "daisy" && query.theme !== null) {
  document.documentElement.dataset.theme = query.theme
}

const root = document.getElementById("app")
if (root === null) {
  throw new Error('The site needs a mount point: index.html must contain <div id="app"></div>.')
}

const styles =
  query.style === "daisy"
    ? import("./daisy.css")
    : import("@ui-sdk/core/web.css")

styles
  .then(() => {
    const Main = BrowserHost.mount(
      Page,
      { only: query.only, style: query.style, theme: query.theme },
      root
    ).pipe(Layer.provide(DevTools.layer({ position: "BottomRight" })))

    Layer.launch(Main).pipe(Effect.runFork)
  })
  .catch((error: unknown) => {
    console.error("Failed to load styles", error)
  })
