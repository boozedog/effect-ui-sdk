// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/tabs"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Switch between related panels with one tab selected at a time.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const Root = Html.customElement({
  tag: "ui-tabs",
  properties: {
    value: Schema.NullOr(Schema.String),
    defaultValue: Schema.NullOr(Schema.String),
    orientation: Schema.Literals(["horizontal", "vertical"]),
    activation: Schema.Literals(["automatic", "manual"]),
    loop: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.NullOr(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-tabs>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const Indicator = Html.customElement({
  tag: "ui-tabs-indicator",
  properties: {
    followHover: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-tabs>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const List = Html.customElement({
  tag: "ui-tabs-list",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-tabs>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const Panel = Html.customElement({
  tag: "ui-tabs-panel",
  properties: {
    value: Schema.String,
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
  },
  events: {
  },
})

/**
 * A wrapper, so the tab stays a real button with its built-in behavior. It has no role, so the tab list still sees its tabs as direct children.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const Tab = Html.customElement({
  tag: "ui-tabs-tab",
  properties: {
    value: Schema.String,
    disabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * An icon inside a tab's button. Screen readers skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/tabs
 */
export const TabIcon = Html.customElement({
  tag: "ui-tabs-tab-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})
