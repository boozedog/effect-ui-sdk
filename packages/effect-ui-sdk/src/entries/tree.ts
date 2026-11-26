// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/tree"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Browse a hierarchy of files, pages, or choices with expandable branches.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const Root = Html.customElement({
  tag: "ui-tree",
  properties: {
    value: Schema.String,
    expanded: Schema.Array(Schema.String),
    checked: Schema.Array(Schema.String),
    items: Schema.Array(Schema.Unknown),
    paths: Schema.Array(Schema.String),
    loadChildren: Schema.Unknown,
    announcement: Schema.Unknown,
    mode: Schema.Literals(["multiple", "none", "single"]),
    defaultValue: Schema.String,
    activation: Schema.Literals(["automatic", "manual"]),
    defaultExpanded: Schema.Array(Schema.String),
    expandOnPress: Schema.Boolean,
    checkable: Schema.Boolean,
    defaultChecked: Schema.Array(Schema.String),
    checkStrategy: Schema.Literals(["branch", "leaf", "trunk", "independent"]),
    pendingAnnouncement: Schema.String,
    current: Schema.NullOr(Schema.String),
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
    "expandedchange": Schema.Struct({
      value: Schema.Array(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
    "checkedchange": Schema.Struct({
      value: Schema.Array(Schema.String),
      reason: Schema.String,
      source: Schema.String,
    }),
    "action": Schema.Struct({}),
    "highlight": Schema.Struct({ value: Schema.String, index: Schema.Number }),
  },
})

/**
 * Part of `<ui-tree>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const Group = Html.customElement({
  tag: "ui-tree-group",
  properties: {
    keepMounted: Schema.Boolean,
    hiddenUntilFound: Schema.Boolean,
  },
  events: {
  },
})

/**
 * An item's parent is the item around it, and a group inside it makes it a branch.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const Item = Html.customElement({
  tag: "ui-tree-item",
  properties: {
    value: Schema.String,
    branch: Schema.Boolean,
    disabled: Schema.Boolean,
    label: Schema.String,
  },
  events: {
  },
})

/**
 * Part of `<ui-tree>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const ItemCheckbox = Html.customElement({
  tag: "ui-tree-item-checkbox",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-tree>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const ItemIndicator = Html.customElement({
  tag: "ui-tree-item-indicator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-tree>`.
 * @see https://ui-sdk.dev/docs/web-components/components/tree
 */
export const ItemLabel = Html.customElement({
  tag: "ui-tree-item-label",
  properties: {
  },
  events: {
  },
})
