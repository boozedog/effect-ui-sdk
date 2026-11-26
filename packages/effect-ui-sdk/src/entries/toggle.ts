// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/toggle"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Keep a button pressed, or group toggles with a shared value and arrow-key navigation.
 * @see https://ui-sdk.dev/docs/web-components/components/toggle
 */
export const Root = Html.customElement({
  tag: "ui-toggle",
  properties: {
    pressed: Schema.Boolean,
    defaultPressed: Schema.Boolean,
    value: Schema.String,
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "pressedchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * <ui-toggle-group> holds toggles that share one value, with one tab stop and arrow keys between them. `value` and `default-value` take comma-separated values.
 * @see https://ui-sdk.dev/docs/web-components/components/toggle
 */
export const Group = Html.customElement({
  tag: "ui-toggle-group",
  properties: {
    value: Schema.Array(Schema.String),
    defaultValue: Schema.Array(Schema.String),
    multiple: Schema.Boolean,
    deselectable: Schema.Boolean,
    disabled: Schema.Boolean,
    orientation: Schema.Literals(["horizontal", "vertical"]),
    loop: Schema.Boolean,
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
 * An icon inside the toggle's button. Screen readers skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/toggle
 */
export const Icon = Html.customElement({
  tag: "ui-toggle-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})
