// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/checkbox"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Choose one or more options, individually or as a group.
 * @see https://ui-sdk.dev/docs/web-components/components/checkbox
 */
export const Root = Html.customElement({
  tag: "ui-checkbox",
  properties: {
    checked: Schema.Union([Schema.Boolean, Schema.Literal("indeterminate")]),
    name: Schema.String,
    defaultChecked: Schema.Union([Schema.Boolean, Schema.Literal("indeterminate")]),
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    value: Schema.String,
    parent: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "checkedchange": Schema.Struct({
      value: Schema.Union([Schema.Boolean, Schema.Literal("indeterminate")]),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * <ui-checkbox-group> takes part in forms like native checkboxes that share a name: it submits every checked value under its `name`.
 * @see https://ui-sdk.dev/docs/web-components/components/checkbox
 */
export const Group = Html.customElement({
  tag: "ui-checkbox-group",
  properties: {
    value: Schema.Array(Schema.String),
    name: Schema.String,
    defaultValue: Schema.Array(Schema.String),
    allValues: Schema.Array(Schema.String),
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.Array(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-checkbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/checkbox
 */
export const Indicator = Html.customElement({
  tag: "ui-checkbox-indicator",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})
