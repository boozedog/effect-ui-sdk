// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/trigger-menu"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * "Opens suggestions at the caret when you type a trigger such as @, /, or #."
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Root = Html.customElement({
  tag: "ui-trigger-menu",
  properties: {
    open: Schema.Boolean,
    triggers: Schema.Array(Schema.Unknown),
    editor: Schema.Unknown,
    container: Schema.Unknown,
    pendingAnnouncement: Schema.String,
    status: Schema.Literals(["error", "idle", "loading"]),
    autoHighlight: Schema.Boolean,
    loop: Schema.Boolean,
    shortcut: Schema.String,
    dismissible: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "openchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
      trigger: Schema.NullOr(Schema.String),
    }),
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
    "querychange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
      trigger: Schema.String,
      argument: Schema.optional(Schema.String),
    }),
    "itemselect": Schema.Unknown,
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Content = Html.customElement({
  tag: "ui-trigger-menu-content",
  properties: {
    anchor: Schema.Unknown,
    side: Schema.Literals(["top", "bottom", "left", "right", "start", "end"]),
    align: Schema.Literals(["center", "start", "end"]),
    sideOffset: Schema.Number,
    alignOffset: Schema.Number,
    collisionPadding: Schema.Number,
    arrowPadding: Schema.Number,
    container: Schema.Unknown,
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Empty = Html.customElement({
  tag: "ui-trigger-menu-empty",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Group = Html.customElement({
  tag: "ui-trigger-menu-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const GroupLabel = Html.customElement({
  tag: "ui-trigger-menu-group-label",
  properties: {
  },
  events: {
  },
})

/**
 * Without content, the hint shows the arguments to type.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Hint = Html.customElement({
  tag: "ui-trigger-menu-hint",
  properties: {
  },
  events: {
  },
})

/**
 * A wrapper, so the field stays a real textarea or input.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Input = Html.customElement({
  tag: "ui-trigger-menu-input",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Item = Html.customElement({
  tag: "ui-trigger-menu-item",
  properties: {
    value: Schema.Unknown,
    label: Schema.String,
    keywords: Schema.Array(Schema.String),
    disabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * An icon inside a suggestion. Screen readers and filtering skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const ItemIcon = Html.customElement({
  tag: "ui-trigger-menu-item-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const List = Html.customElement({
  tag: "ui-trigger-menu-list",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-trigger-menu>`.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Separator = Html.customElement({
  tag: "ui-trigger-menu-separator",
  properties: {
  },
  events: {
  },
})

/**
 * Without content, the status says the count and the keys.
 * @see https://ui-sdk.dev/docs/web-components/components/trigger-menu
 */
export const Status = Html.customElement({
  tag: "ui-trigger-menu-status",
  properties: {
  },
  events: {
  },
})
