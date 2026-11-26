// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/preferences"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Apply user preferences to data attributes so your styles can follow them.
 * @see https://ui-sdk.dev/docs/web-components/components/preferences
 */
export const Root = Html.customElement({
  tag: "ui-preferences",
  properties: {
    preferences: Schema.Array(Schema.Unknown),
  },
  events: {
  },
})
