// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/scroll-area"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Add styled scrollbars, edge indicators, and follow-to-end behavior to native scrolling.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Root = Html.customElement({
  tag: "ui-scroll-area",
  properties: {
    type: Schema.Literals(["scroll", "always", "auto", "hover"]),
    scrollHideDelay: Schema.Number,
    stickToEnd: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-scroll-area>`.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Content = Html.customElement({
  tag: "ui-scroll-area-content",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-scroll-area>`.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Corner = Html.customElement({
  tag: "ui-scroll-area-corner",
  properties: {
  },
  events: {
  },
})

/**
 * A wrapper, so the button stays a real button with its built-in behavior.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const ScrollToEnd = Html.customElement({
  tag: "ui-scroll-area-scroll-to-end",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-scroll-area>`.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Scrollbar = Html.customElement({
  tag: "ui-scroll-area-scrollbar",
  properties: {
    orientation: Schema.Literals(["horizontal", "vertical"]),
  },
  events: {
  },
})

/**
 * Part of `<ui-scroll-area>`.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Thumb = Html.customElement({
  tag: "ui-scroll-area-thumb",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-scroll-area>`.
 * @see https://ui-sdk.dev/docs/web-components/components/scroll-area
 */
export const Viewport = Html.customElement({
  tag: "ui-scroll-area-viewport",
  properties: {
  },
  events: {
  },
})
