// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/separator"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Divide groups of content with a horizontal or vertical line.
 * @see https://ui-sdk.dev/docs/web-components/components/separator
 */
export const Root = Html.customElement({
  tag: "ui-separator",
  properties: {
    orientation: Schema.Literals(["horizontal", "vertical"]),
    decorative: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})
