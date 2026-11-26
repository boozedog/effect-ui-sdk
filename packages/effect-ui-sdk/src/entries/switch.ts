// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/switch"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Turn a setting on or off.
 * @see https://ui-sdk.dev/docs/web-components/components/switch
 */
export const Root = Html.customElement({
  tag: "ui-switch",
  properties: {
    checked: Schema.Boolean,
    name: Schema.String,
    defaultChecked: Schema.Boolean,
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    value: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
    "checkedchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-switch>`.
 * @see https://ui-sdk.dev/docs/web-components/components/switch
 */
export const Thumb = Html.customElement({
  tag: "ui-switch-thumb",
  properties: {
  },
  events: {
  },
})
