// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/select"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Choose one value or several from a popup list.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Root = Html.customElement({
  tag: "ui-select",
  properties: {
    value: Schema.Unknown,
    query: Schema.String,
    open: Schema.Boolean,
    items: Schema.Unknown,
    emptyItems: Schema.Unknown,
    announcement: Schema.Unknown,
    itemToValue: Schema.Unknown,
    itemToLabel: Schema.Unknown,
    isItemEqualToValue: Schema.Unknown,
    filter: Schema.Unknown,
    name: Schema.String,
    container: Schema.Unknown,
    defaultValue: Schema.Unknown,
    defaultOpen: Schema.Boolean,
    multiple: Schema.Boolean,
    defaultQuery: Schema.String,
    status: Schema.Literals(["error", "idle", "loading"]),
    placeholder: Schema.String,
    loop: Schema.Boolean,
    virtualFocus: Schema.Boolean,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("pointer")]),
    presentation: Schema.Literals(["popover", "sheet", "auto"]),
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    autoComplete: Schema.String,
    dismissible: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "openchange": Schema.Struct({
      value: Schema.Boolean,
      reason: Schema.String,
      source: Schema.String,
    }),
    "openchangecomplete": Schema.Struct({ value: Schema.Boolean }),
    "querychange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
    "loadmore": Schema.Struct({}),
    "highlight": Schema.Struct({ value: Schema.Unknown, index: Schema.Number }),
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
    "valuechange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Arrow = Html.customElement({
  tag: "ui-select-arrow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Clear = Html.customElement({
  tag: "ui-select-clear",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Content = Html.customElement({
  tag: "ui-select-content",
  properties: {
    anchor: Schema.Unknown,
    side: Schema.Literals(["top", "bottom", "left", "right", "start", "end"]),
    align: Schema.Literals(["center", "start", "end"]),
    sideOffset: Schema.Number,
    alignOffset: Schema.Number,
    collisionPadding: Schema.Number,
    arrowPadding: Schema.Number,
    container: Schema.Unknown,
    alignItemWithTrigger: Schema.Boolean,
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Empty = Html.customElement({
  tag: "ui-select-empty",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Group = Html.customElement({
  tag: "ui-select-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const GroupLabel = Html.customElement({
  tag: "ui-select-group-label",
  properties: {
  },
  events: {
  },
})

/**
 * A wrapper, so the search field stays a real input.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Input = Html.customElement({
  tag: "ui-select-input",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Item = Html.customElement({
  tag: "ui-select-item",
  properties: {
    value: Schema.Unknown,
    label: Schema.String,
    disabled: Schema.Boolean,
    index: Schema.Number,
  },
  events: {
  },
})

/**
 * An icon inside an item. Screen readers, typeahead and the search skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const ItemIcon = Html.customElement({
  tag: "ui-select-item-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const ItemIndicator = Html.customElement({
  tag: "ui-select-item-indicator",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Its text, with what the search matched in <mark>. It holds text only.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const ItemText = Html.customElement({
  tag: "ui-select-item-text",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Label = Html.customElement({
  tag: "ui-select-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const List = Html.customElement({
  tag: "ui-select-list",
  properties: {
  },
  events: {
  },
})

/**
 * Selects every item that matches, in its <ui-select-group> or in the whole list.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const SelectAll = Html.customElement({
  tag: "ui-select-select-all",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Separator = Html.customElement({
  tag: "ui-select-separator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Status = Html.customElement({
  tag: "ui-select-status",
  properties: {
  },
  events: {
  },
})

/**
 * A wrapper, so the trigger stays a real button. An empty button shows the value.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Trigger = Html.customElement({
  tag: "ui-select-trigger",
  properties: {
    disabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-select>`.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const Value = Html.customElement({
  tag: "ui-select-value",
  properties: {
    getMoreLabel: Schema.Unknown,
    placeholder: Schema.String,
    maxLabels: Schema.Number,
  },
  events: {
  },
})

/**
 * The selected item's icon, copied from its <ui-select-item-icon>, like before the value in the trigger.
 * @see https://ui-sdk.dev/docs/web-components/components/select
 */
export const ValueIcon = Html.customElement({
  tag: "ui-select-value-icon",
  properties: {
  },
  events: {
  },
})
