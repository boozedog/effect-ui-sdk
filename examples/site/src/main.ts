import "./site.css"
import { Effect, Layer } from "effect"
import { BrowserHost } from "@effect/ui/html"
import { CatalogPage } from "./app"

// `?only=` filters the catalog, as a query string rather than a path, so the
// site needs no router and GitHub Pages needs no 404 fallback: every URL is
// still `index.html`. A comma separates values.
const only = new URLSearchParams(window.location.search)
  .get("only")
  ?.split(",")
  .map((value) => value.trim().toLowerCase())
  .filter((value) => value !== "") ?? []

const Main = BrowserHost.mount(CatalogPage, { only }, document.getElementById("app")!)

Layer.launch(Main).pipe(Effect.runFork)
