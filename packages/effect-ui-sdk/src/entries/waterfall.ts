// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/waterfall"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show a trace or a page's requests as bars on a shared time axis, with spans that expand to show what they started.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Root = Html.customElement({
  tag: "ui-waterfall",
  properties: {
    value: Schema.NullOr(Schema.String),
    expanded: Schema.Array(Schema.String),
    items: Schema.Array(Schema.Unknown),
    range: Schema.Tuple([Schema.Number, Schema.Number]),
    format: Schema.Unknown,
    getBarLabel: Schema.Unknown,
    defaultValue: Schema.NullOr(Schema.String),
    defaultExpanded: Schema.Array(Schema.String),
    locale: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.NullOr(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
    "expandedchange": Schema.Struct({
      value: Schema.Array(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
    "highlight": Schema.Struct({ value: Schema.String, index: Schema.Number }),
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Axis = Html.customElement({
  tag: "ui-waterfall-axis",
  properties: {
    maxTicks: Schema.Number,
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Bar = Html.customElement({
  tag: "ui-waterfall-bar",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Cell = Html.customElement({
  tag: "ui-waterfall-cell",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const ColumnHeader = Html.customElement({
  tag: "ui-waterfall-column-header",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const HeaderRow = Html.customElement({
  tag: "ui-waterfall-header-row",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Indicator = Html.customElement({
  tag: "ui-waterfall-indicator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Mark = Html.customElement({
  tag: "ui-waterfall-mark",
  properties: {
    time: Schema.Number,
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Row = Html.customElement({
  tag: "ui-waterfall-row",
  properties: {
    value: Schema.String,
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const RowHeader = Html.customElement({
  tag: "ui-waterfall-row-header",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-waterfall>`.
 * @see https://ui-sdk.dev/docs/web-components/components/waterfall
 */
export const Tick = Html.customElement({
  tag: "ui-waterfall-tick",
  properties: {
    time: Schema.Number,
  },
  events: {
  },
})
