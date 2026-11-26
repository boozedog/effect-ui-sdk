// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/input"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Enter text, add a clear button, and connect the value to your form or state.
 * @see https://ui-sdk.dev/docs/web-components/components/input
 */
export const Root = Html.customElement({
  tag: "ui-input",
  properties: {
    value: Schema.String,
    defaultValue: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-input-group>`.
 * @see https://ui-sdk.dev/docs/web-components/components/input
 */
export const Clear = Html.customElement({
  tag: "ui-input-clear",
  properties: {
  },
  events: {
  },
})

/**
 * <ui-input-group> holds a field with icons, text and buttons around it. Presses on its text and icons focus the field. <ui-input-clear> wraps a button that empties the field, shown while there's tex...
 * @see https://ui-sdk.dev/docs/web-components/components/input
 */
export const Group = Html.customElement({
  tag: "ui-input-group",
  properties: {
    debug: Schema.Boolean,
  },
  events: {
  },
})
