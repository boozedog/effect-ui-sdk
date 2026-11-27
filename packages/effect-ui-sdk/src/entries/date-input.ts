// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/date-input"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Type a date one part at a time, in the order your user's language writes it.
 * @see https://ui-sdk.dev/docs/web-components/components/date-input
 */
export const Root = Html.customElement({
  tag: "ui-date-input",
  properties: {
    value: Schema.NullOr(Schema.String),
    unavailable: Schema.Unknown,
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
 * Part of `<ui-date-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/date-input
 */
export const Segment = Html.customElement({
  tag: "ui-date-input-segment",
  properties: {
    segment: Schema.Unknown,
  },
  events: {
  },
})
