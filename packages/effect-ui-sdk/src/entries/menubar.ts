// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/menubar"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Move between an application’s menus with one tab stop.
 * @see https://ui-sdk.dev/docs/web-components/components/menubar
 */
export const Root = Html.customElement({
  tag: "ui-menubar",
  properties: {
    orientation: Schema.Literals(["horizontal", "vertical"]),
    loop: Schema.Boolean,
    disabled: Schema.Boolean,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("pointer")]),
    debug: Schema.Boolean,
  },
  events: {
  },
})
