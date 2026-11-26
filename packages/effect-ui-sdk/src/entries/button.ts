// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/button"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Run an action, show that it's working, and keep it reachable when disabled.
 * @see https://ui-sdk.dev/docs/web-components/components/button
 */
export const Root = Html.customElement({
  tag: "ui-button",
  properties: {
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
    pendingAnnouncement: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
  },
})
