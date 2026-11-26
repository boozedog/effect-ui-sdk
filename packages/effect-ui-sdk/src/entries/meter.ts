// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/meter"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show a measurement within a known range, such as storage used or an account quota.
 * @see https://ui-sdk.dev/docs/web-components/components/meter
 */
export const Root = Html.customElement({
  tag: "ui-meter",
  properties: {
    format: Schema.Unknown,
    getValueLabel: Schema.Unknown,
    min: Schema.Number,
    max: Schema.Number,
    locale: Schema.String,
    value: Schema.Number,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-meter>`.
 * @see https://ui-sdk.dev/docs/web-components/components/meter
 */
export const Indicator = Html.customElement({
  tag: "ui-meter-indicator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-meter>`.
 * @see https://ui-sdk.dev/docs/web-components/components/meter
 */
export const Label = Html.customElement({
  tag: "ui-meter-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-meter>`.
 * @see https://ui-sdk.dev/docs/web-components/components/meter
 */
export const Track = Html.customElement({
  tag: "ui-meter-track",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-meter>`.
 * @see https://ui-sdk.dev/docs/web-components/components/meter
 */
export const Value = Html.customElement({
  tag: "ui-meter-value",
  properties: {
  },
  events: {
  },
})
