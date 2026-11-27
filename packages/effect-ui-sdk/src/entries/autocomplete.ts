// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/autocomplete"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Suggest text while someone types, without limiting what they can enter.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Root = Html.customElement({
  tag: "ui-autocomplete",
  properties: {
    value: Schema.String,
    open: Schema.Boolean,
    items: Schema.Unknown,
    emptyItems: Schema.Unknown,
    announcement: Schema.Unknown,
    filter: Schema.Unknown,
    container: Schema.Unknown,
    defaultValue: Schema.String,
    defaultOpen: Schema.Boolean,
    inlineComplete: Schema.Boolean,
    autoHighlight: Schema.Boolean,
    openOnFocus: Schema.Boolean,
    submitOnSelect: Schema.Boolean,
    status: Schema.Literals(["error", "idle", "loading"]),
    loop: Schema.Boolean,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("pointer")]),
    presentation: Schema.Literals(["popover", "sheet", "auto"]),
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    name: Schema.String,
    form: Schema.String,
    dismissible: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
    "openchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
    "submit": Schema.Struct({ value: Schema.String }),
    "highlight": Schema.Struct({ value: Schema.Unknown, index: Schema.Number }),
    "loadmore": Schema.Struct({}),
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Arrow = Html.customElement({
  tag: "ui-autocomplete-arrow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Clear = Html.customElement({
  tag: "ui-autocomplete-clear",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Content = Html.customElement({
  tag: "ui-autocomplete-content",
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
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Empty = Html.customElement({
  tag: "ui-autocomplete-empty",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Group = Html.customElement({
  tag: "ui-autocomplete-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const GroupLabel = Html.customElement({
  tag: "ui-autocomplete-group-label",
  properties: {
  },
  events: {
  },
})

/**
 * Wrappers, so the field stays a real input and the buttons real buttons.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Input = Html.customElement({
  tag: "ui-autocomplete-input",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Item = Html.customElement({
  tag: "ui-autocomplete-item",
  properties: {
    value: Schema.String,
    label: Schema.String,
    keywords: Schema.Array(Schema.String),
    disabled: Schema.Boolean,
    index: Schema.Number,
  },
  events: {
  },
})

/**
 * An icon inside a suggestion. Screen readers and filtering skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const ItemIcon = Html.customElement({
  tag: "ui-autocomplete-item-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Its text, with what the field's text matched in <mark>. It holds text only.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const ItemText = Html.customElement({
  tag: "ui-autocomplete-item-text",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Label = Html.customElement({
  tag: "ui-autocomplete-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const List = Html.customElement({
  tag: "ui-autocomplete-list",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Separator = Html.customElement({
  tag: "ui-autocomplete-separator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Status = Html.customElement({
  tag: "ui-autocomplete-status",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-autocomplete>`.
 * @see https://ui-sdk.dev/docs/web-components/components/autocomplete
 */
export const Trigger = Html.customElement({
  tag: "ui-autocomplete-trigger",
  properties: {
  },
  events: {
  },
})
