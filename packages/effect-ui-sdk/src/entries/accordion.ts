// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/accordion"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show and hide sections of content from their headings.
 * @see https://ui-sdk.dev/docs/web-components/components/accordion
 */
export const Root = Html.customElement({
  tag: "ui-accordion",
  properties: {
    value: Schema.Array(Schema.String),
    defaultValue: Schema.Array(Schema.String),
    multiple: Schema.Boolean,
    collapsible: Schema.Boolean,
    disabled: Schema.Boolean,
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.Array(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Binds to the heading inside it. Without one, the element is the heading.
 * @see https://ui-sdk.dev/docs/web-components/components/accordion
 */
export const Header = Html.customElement({
  tag: "ui-accordion-header",
  properties: {
  },
  events: {
  },
})

/**
 * Fires `openchange` and `openchangecomplete` with the item's open state.
 * @see https://ui-sdk.dev/docs/web-components/components/accordion
 */
export const Item = Html.customElement({
  tag: "ui-accordion-item",
  properties: {
    value: Schema.String,
    disabled: Schema.Boolean,
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
 * Part of `<ui-accordion>`.
 * @see https://ui-sdk.dev/docs/web-components/components/accordion
 */
export const Panel = Html.customElement({
  tag: "ui-accordion-panel",
  properties: {
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
  },
  events: {
  },
})

/**
 * A wrapper, so the trigger stays a real button with its built-in behavior.
 * @see https://ui-sdk.dev/docs/web-components/components/accordion
 */
export const Trigger = Html.customElement({
  tag: "ui-accordion-trigger",
  properties: {
    disabled: Schema.Boolean,
  },
  events: {
  },
})
