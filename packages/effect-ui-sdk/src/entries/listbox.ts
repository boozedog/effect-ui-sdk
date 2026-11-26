// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/listbox"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Choose one or several options from an always-visible list.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const Root = Html.customElement({
  tag: "ui-listbox",
  properties: {
    value: Schema.Unknown,
    items: Schema.Unknown,
    itemToValue: Schema.Unknown,
    isItemEqualToValue: Schema.Unknown,
    name: Schema.String,
    defaultValue: Schema.Unknown,
    multiple: Schema.Boolean,
    activation: Schema.Literals(["automatic", "manual"]),
    deselectable: Schema.Boolean,
    orientation: Schema.Literals(["horizontal", "vertical"]),
    loop: Schema.Boolean,
    virtualFocus: Schema.Boolean,
    keepInView: Schema.Boolean,
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "highlight": Schema.Struct({ value: Schema.Unknown }),
    "valuechange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-listbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const Group = Html.customElement({
  tag: "ui-listbox-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-listbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const GroupLabel = Html.customElement({
  tag: "ui-listbox-group-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-listbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const Item = Html.customElement({
  tag: "ui-listbox-item",
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
 * An icon inside an item. Screen readers and typeahead skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const ItemIcon = Html.customElement({
  tag: "ui-listbox-item-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-listbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const ItemIndicator = Html.customElement({
  tag: "ui-listbox-item-indicator",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-listbox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/listbox
 */
export const Separator = Html.customElement({
  tag: "ui-listbox-separator",
  properties: {
  },
  events: {
  },
})
