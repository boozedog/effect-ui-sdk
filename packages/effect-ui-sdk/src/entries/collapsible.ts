// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/collapsible"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show and hide a panel, preserve its contents, and animate its height.
 * @see https://ui-sdk.dev/docs/web-components/components/collapsible
 */
export const Root = Html.customElement({
  tag: "ui-collapsible",
  properties: {
    open: Schema.Boolean,
    defaultOpen: Schema.Boolean,
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "openchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
  },
})

/**
 * Part of `<ui-collapsible>`.
 * @see https://ui-sdk.dev/docs/web-components/components/collapsible
 */
export const Panel = Html.customElement({
  tag: "ui-collapsible-panel",
  properties: {
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
  },
  events: {
  },
})

/**
 * A wrapper, so the trigger stays a real button with its built-in behavior.
 * @see https://ui-sdk.dev/docs/web-components/components/collapsible
 */
export const Trigger = Html.customElement({
  tag: "ui-collapsible-trigger",
  properties: {
  },
  events: {
  },
})
