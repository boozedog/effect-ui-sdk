// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/combobox"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Search a list of options and choose one or several values.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Root = Html.customElement({
  tag: "ui-combobox",
  properties: {
    value: Schema.Unknown,
    query: Schema.String,
    open: Schema.Boolean,
    items: Schema.Unknown,
    emptyItems: Schema.Unknown,
    itemToValue: Schema.Unknown,
    itemToLabel: Schema.Unknown,
    isItemEqualToValue: Schema.Unknown,
    announcement: Schema.Unknown,
    filter: Schema.Unknown,
    name: Schema.String,
    container: Schema.Unknown,
    defaultValue: Schema.Unknown,
    defaultQuery: Schema.String,
    defaultOpen: Schema.Boolean,
    multiple: Schema.Boolean,
    maxSelected: Schema.Number,
    pendingAnnouncement: Schema.String,
    autoHighlight: Schema.Union([Schema.Boolean, Schema.Literals(["always", "selected"])]),
    keepQuery: Schema.Boolean,
    allowCustomValue: Schema.Boolean,
    status: Schema.Literals(["error", "idle", "loading"]),
    loop: Schema.Boolean,
    modal: Schema.Union([Schema.Boolean, Schema.Literal("pointer")]),
    presentation: Schema.Literals(["popover", "sheet", "auto"]),
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    dismissible: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "querychange": Schema.Struct({
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
    "highlight": Schema.Struct({ value: Schema.Unknown, index: Schema.Number }),
    "loadmore": Schema.Struct({}),
    "dismissattempt": Schema.Struct({ reason: Schema.String }),
    "valuechange": Schema.Struct({
      value: Schema.Unknown,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Arrow = Html.customElement({
  tag: "ui-combobox-arrow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Chip = Html.customElement({
  tag: "ui-combobox-chip",
  properties: {
    value: Schema.Unknown,
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ChipRemove = Html.customElement({
  tag: "ui-combobox-chip-remove",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Chips = Html.customElement({
  tag: "ui-combobox-chips",
  properties: {
  },
  events: {
  },
})

/**
 * "+2 more" once chips don't fit on the chips' line. Rendering it turns collapsing on.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ChipsOverflow = Html.customElement({
  tag: "ui-combobox-chips-overflow",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Clear = Html.customElement({
  tag: "ui-combobox-clear",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Content = Html.customElement({
  tag: "ui-combobox-content",
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
 * Without content, it offers to create the text: Create “…”. Listen for `create`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Create = Html.customElement({
  tag: "ui-combobox-create",
  properties: {
    minLength: Schema.Number,
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Empty = Html.customElement({
  tag: "ui-combobox-empty",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Group = Html.customElement({
  tag: "ui-combobox-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const GroupLabel = Html.customElement({
  tag: "ui-combobox-group-label",
  properties: {
  },
  events: {
  },
})

/**
 * A wrapper, so the input stays a real input.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Input = Html.customElement({
  tag: "ui-combobox-input",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Item = Html.customElement({
  tag: "ui-combobox-item",
  properties: {
    value: Schema.Unknown,
    label: Schema.String,
    keywords: Schema.Array(Schema.String),
    disabled: Schema.Boolean,
    index: Schema.Number,
  },
  events: {
  },
})

/**
 * An icon inside an item. Screen readers and filtering skip it.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ItemIcon = Html.customElement({
  tag: "ui-combobox-item-icon",
  properties: {
    mirror: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ItemIndicator = Html.customElement({
  tag: "ui-combobox-item-indicator",
  properties: {
    keepMounted: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Its text, with what the input's text matched in <mark>. It holds text only.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ItemText = Html.customElement({
  tag: "ui-combobox-item-text",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Label = Html.customElement({
  tag: "ui-combobox-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const List = Html.customElement({
  tag: "ui-combobox-list",
  properties: {
  },
  events: {
  },
})

/**
 * Selects every item that matches, in its <ui-combobox-group> or in the whole list.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const SelectAll = Html.customElement({
  tag: "ui-combobox-select-all",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Separator = Html.customElement({
  tag: "ui-combobox-separator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Status = Html.customElement({
  tag: "ui-combobox-status",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-combobox>`.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const Trigger = Html.customElement({
  tag: "ui-combobox-trigger",
  properties: {
  },
  events: {
  },
})

/**
 * The selected item's icon, copied from its <ui-combobox-item-icon>, like next to the input.
 * @see https://ui-sdk.dev/docs/web-components/components/combobox
 */
export const ValueIcon = Html.customElement({
  tag: "ui-combobox-value-icon",
  properties: {
  },
  events: {
  },
})
