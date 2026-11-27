// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/hover-card"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Preview a link on hover or keyboard focus while keeping its normal navigation.
 * @see https://ui-sdk.dev/docs/web-components/components/hover-card
 */
export const Root = Html.customElement({
  tag: "ui-hover-card",
  properties: {
    open: Schema.Boolean,
    container: Schema.Unknown,
    defaultOpen: Schema.Boolean,
    delay: Schema.Number,
    closeDelay: Schema.Number,
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
    "payloadchange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-hover-card>`.
 * @see https://ui-sdk.dev/docs/web-components/components/hover-card
 */
export const Arrow = Html.customElement({
  tag: "ui-hover-card-arrow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-hover-card>`.
 * @see https://ui-sdk.dev/docs/web-components/components/hover-card
 */
export const Content = Html.customElement({
  tag: "ui-hover-card-content",
  properties: {
    anchor: Schema.Unknown,
    side: Schema.Literals(["top", "bottom", "left", "right", "start", "end"]),
    align: Schema.Literals(["center", "start", "end"]),
    sideOffset: Schema.Number,
    alignOffset: Schema.Number,
    collisionPadding: Schema.Number,
    container: Schema.Unknown,
    arrowPadding: Schema.Number,
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * The trigger wraps the user's own link, so it stays one. With `for="card-id"`, it opens that card from anywhere on the page.
 * @see https://ui-sdk.dev/docs/web-components/components/hover-card
 */
export const Trigger = Html.customElement({
  tag: "ui-hover-card-trigger",
  properties: {
    payload: Schema.Unknown,
  },
  events: {
  },
})
