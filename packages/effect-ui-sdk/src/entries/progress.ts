// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/progress"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show a task’s progress, or an indeterminate state while its progress is unknown.
 * @see https://ui-sdk.dev/docs/web-components/components/progress
 */
export const Root = Html.customElement({
  tag: "ui-progress",
  properties: {
    format: Schema.Unknown,
    getValueLabel: Schema.Unknown,
    min: Schema.Number,
    max: Schema.Number,
    locale: Schema.String,
    value: Schema.NullOr(Schema.Number),
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-progress>`.
 * @see https://ui-sdk.dev/docs/web-components/components/progress
 */
export const Indicator = Html.customElement({
  tag: "ui-progress-indicator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-progress>`.
 * @see https://ui-sdk.dev/docs/web-components/components/progress
 */
export const Label = Html.customElement({
  tag: "ui-progress-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-progress>`.
 * @see https://ui-sdk.dev/docs/web-components/components/progress
 */
export const Track = Html.customElement({
  tag: "ui-progress-track",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-progress>`.
 * @see https://ui-sdk.dev/docs/web-components/components/progress
 */
export const Value = Html.customElement({
  tag: "ui-progress-value",
  properties: {
  },
  events: {
  },
})
