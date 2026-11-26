// The tile frame is page layout, not a component style. A gap names the entry
// and links to the catalog. It mounts no custom element.
import type { View } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import type { Entry } from "@boozedog/effect-ui-sdk/catalog"
import { href } from "../query"

export const reported = (reason: string, source: string): string =>
  reason === "" ? "no event yet" : `reason "${reason}", source "${source}"`

export const tile = <Msg>(
  h: Html.H<Msg>,
  entry: string,
  lede: string,
  readout: string,
  control: View.Input<Msg>
) =>
  h.article
    .class("panel", "tile")
    .attr("id", `sink-${entry}`)
    .attr("data-entry", entry)
    .attr("data-readout", readout)
    .children(
      h.h2.children(entry),
      h.p.class("lede").children(lede),
      control,
      h.dl.class("facts").children(
        h.dt.children("Model"),
        h.dd.class("mono").children(readout)
      )
    )

export const gap = <Msg>(h: Html.H<Msg>, group: Entry) =>
  h.article
    .class("panel", "tile")
    .attr("id", `sink-${group.entry}`)
    .attr("data-entry", group.entry)
    .attr("data-gap", "true")
    .children(
      h.h2.children(group.entry),
      h.p.class("lede").children(
        `${group.tags.length} tag${group.tags.length === 1 ? "" : "s"}`
      ),
      h.a.attr("href", href("catalog", [group.entry])).children("Open in the catalog")
    )
