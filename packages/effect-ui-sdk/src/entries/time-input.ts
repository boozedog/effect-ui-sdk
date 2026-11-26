// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/time-input"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Type a time one part at a time, on the clock your user's language uses.
 * @see https://ui-sdk.dev/docs/web-components/components/time-input
 */
export const Root = Html.customElement({
  tag: "ui-time-input",
  properties: {
    value: Schema.NullOr(Schema.String),
    name: Schema.String,
    defaultValue: Schema.NullOr(Schema.String),
    granularity: Schema.Literals(["day", "hour", "minute", "second"]),
    hourCycle: Schema.Literals([12, 24]),
    min: Schema.String,
    max: Schema.String,
    locale: Schema.String,
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.NullOr(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-time-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/time-input
 */
export const Segment = Html.customElement({
  tag: "ui-time-input-segment",
  properties: {
    segment: Schema.Unknown,
  },
  events: {
  },
})
