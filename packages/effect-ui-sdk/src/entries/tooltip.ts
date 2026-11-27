// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/tooltip"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Name a control or add a short hint on hover and keyboard focus.
 * @see https://ui-sdk.dev/docs/web-components/components/tooltip
 */
export const Root = Html.customElement({
  tag: "ui-tooltip",
  properties: {
    open: Schema.Boolean,
    container: Schema.Unknown,
    defaultOpen: Schema.Boolean,
    delay: Schema.Number,
    closeDelay: Schema.Number,
    disabled: Schema.Boolean,
    toggleable: Schema.Boolean,
    closeOnPress: Schema.Boolean,
    type: Schema.Literals(["label", "description"]),
    shortcut: Schema.String,
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
 * Part of `<ui-tooltip>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tooltip
 */
export const Arrow = Html.customElement({
  tag: "ui-tooltip-arrow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-tooltip>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tooltip
 */
export const Content = Html.customElement({
  tag: "ui-tooltip-content",
  properties: {
    anchor: Schema.Unknown,
    side: Schema.Literals(["top", "bottom", "left", "right", "start", "end"]),
    align: Schema.Literals(["center", "start", "end"]),
    sideOffset: Schema.Number,
    alignOffset: Schema.Number,
    collisionPadding: Schema.Number,
    container: Schema.Unknown,
    arrowPadding: Schema.Number,
  },
  events: {
  },
})

/**
 * Shows the tooltip's shortcut, or its own `shortcut`, when it has no text of its own.
 * @see https://ui-sdk.dev/docs/web-components/components/tooltip
 */
export const Shortcut = Html.customElement({
  tag: "ui-tooltip-shortcut",
  properties: {
    shortcut: Schema.String,
  },
  events: {
  },
})

/**
 * The trigger wraps the user's own button or link, so it stays one. Inside another component's trigger, like <ui-menu-trigger>, it's the button deepest in. With `for="tooltip-id"`, it shows that tool...
 * @see https://ui-sdk.dev/docs/web-components/components/tooltip
 */
export const Trigger = Html.customElement({
  tag: "ui-tooltip-trigger",
  properties: {
    payload: Schema.Unknown,
  },
  events: {
  },
})
