// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/drawer"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * A sheet you can open, drag, and resize from an edge of the screen.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Root = Html.customElement({
  tag: "ui-drawer",
  properties: {
    open: Schema.Boolean,
    snapPoint: Schema.Unknown,
    physics: Schema.Unknown,
    persistentElements: Schema.Array(Schema.Unknown),
    container: Schema.Unknown,
    defaultOpen: Schema.Boolean,
    dismissible: Schema.Boolean,
    pendingAnnouncement: Schema.String,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("trap-focus")]),
    closeOnOutsidePress: Schema.Boolean,
    snapPoints: Schema.Array(Schema.Unknown),
    defaultSnapPoint: Schema.Unknown,
    side: Schema.Literals(["top", "bottom", "left", "right", "start", "end"]),
    modalAbove: Schema.Unknown,
    driver: Schema.Literals(["pointer", "auto", "scroll-snap"]),
    expandOnScroll: Schema.Boolean,
    themeColor: Schema.Boolean,
    preventEdgeSwipe: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
    "openchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
    "payloadchange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
    "snappointchange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Backdrop = Html.customElement({
  tag: "ui-drawer-backdrop",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Close = Html.customElement({
  tag: "ui-drawer-close",
  properties: {
    value: Schema.String,
  },
  events: {
    "action": Schema.Struct({ source: Schema.String }),
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Content = Html.customElement({
  tag: "ui-drawer-content",
  properties: {
    container: Schema.Unknown,
    initialFocus: Schema.Unknown,
    finalFocus: Schema.Unknown,
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Description = Html.customElement({
  tag: "ui-drawer-description",
  properties: {
  },
  events: {
  },
})

/**
 * The grabber wraps a button, like a trigger. Name the button, like aria-label="Resize".
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Handle = Html.customElement({
  tag: "ui-drawer-handle",
  properties: {
  },
  events: {
  },
})

/**
 * With `for="drawer-id"`, an element anywhere, like the page's shell, follows the drawer.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Outlet = Html.customElement({
  tag: "ui-drawer-outlet",
  properties: {
    keyframes: Schema.Unknown,
  },
  events: {
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Shortcut = Html.customElement({
  tag: "ui-drawer-shortcut",
  properties: {
    shortcut: Schema.String,
  },
  events: {
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Title = Html.customElement({
  tag: "ui-drawer-title",
  properties: {
  },
  events: {
  },
})

/**
 * With `for="drawer-id"`, it opens that drawer from anywhere on the page.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Trigger = Html.customElement({
  tag: "ui-drawer-trigger",
  properties: {
    payload: Schema.Unknown,
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
    shortcut: Schema.String,
  },
  events: {
  },
})

/**
 * Part of `<ui-drawer>`.
 * @see https://ui-sdk.dev/docs/web-components/components/drawer
 */
export const Viewport = Html.customElement({
  tag: "ui-drawer-viewport",
  properties: {
  },
  events: {
  },
})
