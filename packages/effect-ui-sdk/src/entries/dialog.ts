// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/dialog"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Open a focused task over the page.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Root = Html.customElement({
  tag: "ui-dialog",
  properties: {
    open: Schema.Boolean,
    persistentElements: Schema.Unknown,
    container: Schema.Unknown,
    defaultOpen: Schema.Boolean,
    dismissible: Schema.Boolean,
    pendingAnnouncement: Schema.String,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("trap-focus")]),
    closeOnOutsidePress: Schema.Boolean,
    presentation: Schema.Literals(["dialog", "sheet", "auto"]),
    debug: Schema.Boolean,
  },
  events: {
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
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
  },
})

/**
 * Part of `<ui-dialog>`.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Backdrop = Html.customElement({
  tag: "ui-dialog-backdrop",
  properties: {
  },
  events: {
  },
})

/**
 * With an `action` attribute, pressing it fires a cancelable `action` event. Pass a Promise to `event.detail.waitUntil()` to keep the dialog open, and the part pending, until it settles.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Close = Html.customElement({
  tag: "ui-dialog-close",
  properties: {
    value: Schema.String,
  },
  events: {
    "action": Schema.Struct({ source: Schema.String }),
  },
})

/**
 * Part of `<ui-dialog>`.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Content = Html.customElement({
  tag: "ui-dialog-content",
  properties: {
    container: Schema.Unknown,
    initialFocus: Schema.Unknown,
    finalFocus: Schema.Unknown,
    keepMounted: Schema.Boolean,
    inline: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-dialog>`.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Description = Html.customElement({
  tag: "ui-dialog-description",
  properties: {
  },
  events: {
  },
})

/**
 * Shows the shortcut of the trigger it's in, or its own `shortcut`, when it has no text of its own.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Shortcut = Html.customElement({
  tag: "ui-dialog-shortcut",
  properties: {
    shortcut: Schema.String,
  },
  events: {
  },
})

/**
 * Part of `<ui-dialog>`.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Title = Html.customElement({
  tag: "ui-dialog-title",
  properties: {
  },
  events: {
  },
})

/**
 * With `for="dialog-id"`, it opens that dialog from anywhere on the page.
 * @see https://ui-sdk.dev/docs/web-components/components/dialog
 */
export const Trigger = Html.customElement({
  tag: "ui-dialog-trigger",
  properties: {
    payload: Schema.Unknown,
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
    shortcut: Schema.String,
  },
  events: {
  },
})
