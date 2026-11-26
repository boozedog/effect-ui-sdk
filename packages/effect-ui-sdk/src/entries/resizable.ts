// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/resizable"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Resize, collapse, and save panel layouts with pointer and keyboard controls.
 * @see https://ui-sdk.dev/docs/web-components/components/resizable
 */
export const Root = Html.customElement({
  tag: "ui-resizable",
  properties: {
    layout: Schema.Array(Schema.Number),
    storage: Schema.Unknown,
    defaultLayout: Schema.Array(Schema.Number),
    orientation: Schema.Literals(["horizontal", "vertical"]),
    disabled: Schema.Boolean,
    step: Schema.Number,
    largeStep: Schema.Number,
    autoSaveId: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
    "layoutchange": Schema.Struct({
      value: Schema.Array(Schema.Number),
      reason: Schema.String,
      source: Schema.String,
    }),
    "layoutcommit": Schema.Struct({
      value: Schema.Array(Schema.Number),
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-resizable>`.
 * @see https://ui-sdk.dev/docs/web-components/components/resizable
 */
export const Handle = Html.customElement({
  tag: "ui-resizable-handle",
  properties: {
    disabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-resizable>`.
 * @see https://ui-sdk.dev/docs/web-components/components/resizable
 */
export const Panel = Html.customElement({
  tag: "ui-resizable-panel",
  properties: {
    id: Schema.String,
    defaultSize: Schema.Unknown,
    minSize: Schema.Unknown,
    maxSize: Schema.Unknown,
    collapsible: Schema.Boolean,
    collapsedSize: Schema.Unknown,
  },
  events: {
  },
})
