// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/otp-input"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Enter a one-time code with support for pasting, autofill, and native form validation.
 * @see https://ui-sdk.dev/docs/web-components/components/otp-input
 */
export const Root = Html.customElement({
  tag: "ui-otp-input",
  properties: {
    value: Schema.String,
    defaultValue: Schema.String,
    maxLength: Schema.Number,
    pattern: Schema.Unknown,
    inputMode: Schema.Literals(["none", "text", "tel", "numeric", "decimal"]),
    textAlign: Schema.Literals(["center", "start", "end"]),
    autoComplete: Schema.String,
    disabled: Schema.Boolean,
    readOnly: Schema.Boolean,
    required: Schema.Boolean,
    name: Schema.String,
    form: Schema.String,
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
    "valuecommit": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-otp-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/otp-input
 */
export const Control = Html.customElement({
  tag: "ui-otp-input-control",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-otp-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/otp-input
 */
export const Group = Html.customElement({
  tag: "ui-otp-input-group",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-otp-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/otp-input
 */
export const Separator = Html.customElement({
  tag: "ui-otp-input-separator",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-otp-input>`.
 * @see https://ui-sdk.dev/docs/web-components/components/otp-input
 */
export const Slot = Html.customElement({
  tag: "ui-otp-input-slot",
  properties: {
    index: Schema.Number,
  },
  events: {
  },
})
