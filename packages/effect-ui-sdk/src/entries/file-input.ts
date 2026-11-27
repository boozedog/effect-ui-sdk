// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/file-input"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Choose, drop, or paste files, validate them, and submit them with a form.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const Root = Html.customElement({
  tag: "ui-file-input",
  properties: {
    value: Schema.Array(Schema.Unknown),
    validate: Schema.Unknown,
    defaultValue: Schema.Array(Schema.Unknown),
    announcement: Schema.Unknown,
    name: Schema.String,
    accept: Schema.Union([Schema.String, Schema.Array(Schema.String)]),
    maxFiles: Schema.Number,
    maxSize: Schema.Number,
    minSize: Schema.Number,
    multiple: Schema.Boolean,
    directory: Schema.Boolean,
    capture: Schema.Union([Schema.Boolean, Schema.Literals(["user", "environment"])]),
    required: Schema.Boolean,
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.Array(Schema.Unknown),
      reason: Schema.String,
      source: Schema.String,
    }),
    "reject": Schema.Struct({
      value: Schema.Array(Schema.Unknown),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * `paste-target` is "document" or a CSS selector.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const Dropzone = Html.customElement({
  tag: "ui-file-input-dropzone",
  properties: {
    target: Schema.Literals(["document", "element"]),
    pasteTarget: Schema.Unknown,
  },
  events: {
  },
})

/**
 * Part of `<ui-file-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const Item = Html.customElement({
  tag: "ui-file-input-item",
  properties: {
    file: Schema.Unknown,
  },
  events: {
  },
})

/**
 * Part of `<ui-file-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const ItemRemove = Html.customElement({
  tag: "ui-file-input-item-remove",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-file-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const List = Html.customElement({
  tag: "ui-file-input-list",
  properties: {
  },
  events: {
  },
})

/**
 * Wraps your own <button>, so it keeps its native behavior.
 * @see https://ui-sdk.dev/docs/web-components/components/file-input
 */
export const Trigger = Html.customElement({
  tag: "ui-file-input-trigger",
  properties: {
  },
  events: {
  },
})
