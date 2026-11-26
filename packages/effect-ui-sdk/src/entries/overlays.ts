// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/overlays"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * <ui-overlay-host> renders what toast() and confirm() open, from anywhere. Mount it once. Set `toast` to `{ attributes, template }` for the toast regions it renders.
 * @see https://ui-sdk.dev/docs/web-components/components/overlays
 */
export const OverlayHost = Html.customElement({
  tag: "ui-overlay-host",
  properties: {
    overlays: Schema.Unknown,
    toast: Schema.Unknown,
  },
  events: {
  },
})
