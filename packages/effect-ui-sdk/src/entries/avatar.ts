// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/avatar"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show an image with a fallback while it loads or if it fails.
 * @see https://ui-sdk.dev/docs/web-components/components/avatar
 */
export const Root = Html.customElement({
  tag: "ui-avatar",
  properties: {
    debug: Schema.Boolean,
  },
  events: {
    "loadingstatuschange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-avatar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/avatar
 */
export const Fallback = Html.customElement({
  tag: "ui-avatar-fallback",
  properties: {
    delay: Schema.Number,
  },
  events: {
  },
})
