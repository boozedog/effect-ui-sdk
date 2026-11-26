// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/rating"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Pick a score from a row of stars, whole or half, with a preview as the pointer moves over them.
 * @see https://ui-sdk.dev/docs/web-components/components/rating
 */
export const Root = Html.customElement({
  tag: "ui-rating",
  properties: {
    value: Schema.NullOr(Schema.Number),
    getValueLabel: Schema.Unknown,
    name: Schema.String,
    defaultValue: Schema.NullOr(Schema.Number),
    max: Schema.Number,
    step: Schema.Number,
    deselectable: Schema.Boolean,
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    loop: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.NullOr(Schema.Number),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-rating>`.
 * @see https://ui-sdk.dev/docs/web-components/components/rating
 */
export const Item = Html.customElement({
  tag: "ui-rating-item",
  properties: {
    index: Schema.Number,
  },
  events: {
  },
})

/**
 * Part of `<ui-rating>`.
 * @see https://ui-sdk.dev/docs/web-components/components/rating
 */
export const Radio = Html.customElement({
  tag: "ui-rating-radio",
  properties: {
    value: Schema.String,
    disabled: Schema.Boolean,
  },
  events: {
  },
})
