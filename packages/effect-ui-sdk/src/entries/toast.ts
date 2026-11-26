// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/toast"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Part of `<ui-toast-region>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Root = Html.customElement({
  tag: "ui-toast",
  properties: {
  },
  events: {
  },
})

/**
 * Runs the toast's action. Without one, an `action` attribute fires a cancelable `action` event; pass a Promise to `event.detail.waitUntil()` to keep the toast open, and the button pending, until it ...
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Action = Html.customElement({
  tag: "ui-toast-action",
  properties: {
    dismiss: Schema.Boolean,
  },
  events: {
    "action": Schema.Struct({ source: Schema.String }),
  },
})

/**
 * Closes the toast. With an `action` attribute, fires `action` first, like the action part.
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Close = Html.customElement({
  tag: "ui-toast-close",
  properties: {
  },
  events: {
    "action": Schema.Struct({ source: Schema.String }),
  },
})

/**
 * Part of `<ui-toast-region>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Description = Html.customElement({
  tag: "ui-toast-description",
  properties: {
  },
  events: {
  },
})

/**
 * <ui-toast-region> shows a toaster's toasts. Place it once. Without children it renders each toast from its data. With a <template> holding a <ui-toast>, it clones that for each toast, and parts wit...
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Region = Html.customElement({
  tag: "ui-toast-region",
  properties: {
    toaster: Schema.Unknown,
    renderToast: Schema.Unknown,
    side: Schema.Literals(["top", "bottom"]),
    align: Schema.Literals(["center", "start", "end"]),
    maxVisible: Schema.Number,
    expanded: Schema.Boolean,
    shortcut: Schema.NullOr(Schema.String),
    pendingAnnouncement: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-toast-region>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toast
 */
export const Title = Html.customElement({
  tag: "ui-toast-title",
  properties: {
  },
  events: {
  },
})
