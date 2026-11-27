// `items` and `range` are properties, and both live at module scope so a
// render writes the same array and tuple every time. Each row names the span
// it shows with `value`, and the waterfall reads its place from `items`.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Waterfall from "@boozedog/effect-ui-sdk/waterfall"
import { Props } from "./face"
import { reported, tile } from "./shell"

const ITEMS = [
  { value: "document", label: "/", start: 0, duration: 180 },
  { value: "styles", label: "app.css", start: 190, duration: 90 },
  { value: "script", label: "app.js", start: 195, duration: 410 },
  { value: "font", label: "inter.woff2", start: 300, duration: 220 },
  { value: "user", label: "api/user", start: 610, duration: 240 },
  { value: "avatar", label: "avatar.png", start: 860, duration: 150 },
] as const

// A mutable tuple: the binding's `range` Schema is `Schema.Tuple`, so a
// `readonly` tuple is not the type it writes.
const RANGE: [number, number] = [0, 1000]

const SIZES: Readonly<Record<string, string>> = {
  document: "14 kB",
  styles: "8 kB",
  script: "212 kB",
  font: "48 kB",
  user: "1 kB",
  avatar: "36 kB",
}

const ROW = { display: "grid", gridTemplateColumns: "1fr auto", columnGap: "0.5rem", alignItems: "baseline" }

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkWaterfall",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: null, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "waterfall",
      "items is the spans, and each row names one with value. A press on a row or an arrow key selects it, and valuechange reports the span it moved to.",
      `value ${model.value ?? "(none)"}; ${reported(model.reason, model.source)}`,
      Waterfall.Root(h)
        .attr("aria-label", "Request waterfall")
        .items(ITEMS)
        .range(RANGE)
        .value(model.value)
        .style({ display: "grid", rowGap: "0.125rem", fontSize: "0.75rem" })
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          Waterfall.HeaderRow(h)
            .style(ROW)
            .children(
              Waterfall.ColumnHeader(h).style({ fontWeight: "600" }).children("Name"),
              Waterfall.ColumnHeader(h)
                .style({ fontWeight: "600" })
                .children("Size"),
              Waterfall.ColumnHeader(h)
                .attr("aria-label", "Timeline")
                .style({ gridColumn: "1 / -1" })
                .children(
                  Waterfall.Axis(h).style({
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "0.625rem",
                    color: "var(--ui-muted-foreground)",
                  })
                )
            ),
          ...ITEMS.map((item) =>
            Waterfall.Row(h)
              .value(item.value)
              .style({
                ...ROW,
                padding: "0.0625rem 0",
                borderTop: "1px solid var(--ui-border)",
              })
              .children(
                Waterfall.RowHeader(h).children(item.label),
                Waterfall.Cell(h).children(SIZES[item.value] ?? ""),
                // The element writes `--waterfall-start` and `--waterfall-size`
                // on the row; the fill reads them, so no measurement here.
                Waterfall.Bar(h)
                  .style({
                    gridColumn: "1 / -1",
                    position: "relative",
                    height: "0.3125rem",
                    background: "var(--ui-muted)",
                  })
                  .children(
                    h.div.style({
                      position: "absolute",
                      insetBlock: "0",
                      insetInlineStart: "var(--waterfall-start)",
                      width: "var(--waterfall-size)",
                      background: "var(--ui-primary)",
                    })
                  )
              )
          )
        )
    ),
})

export { Definition as WaterfallTile }
