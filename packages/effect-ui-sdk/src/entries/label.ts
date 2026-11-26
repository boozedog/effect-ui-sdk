// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/label"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Name any control with a label, and let a press on the label reach it.
 * @see https://ui-sdk.dev/docs/web-components/components/label
 */
export const Root = Html.customElement({
  tag: "ui-label",
  properties: {
    debug: Schema.Boolean,
  },
  events: {
  },
})
