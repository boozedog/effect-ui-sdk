// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/field"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Connect a form control to its label, description, and validation errors.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Root = Html.customElement({
  tag: "ui-field",
  properties: {
    invalid: Schema.Boolean,
    name: Schema.String,
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Describes the nearest field, or the whole field set when no field is closer.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Description = Html.customElement({
  tag: "ui-field-description",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-field>`.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Error = Html.customElement({
  tag: "ui-field-error",
  properties: {
    match: Schema.Union([Schema.Boolean, Schema.Literals(["valueMissing", "rangeUnderflow", "rangeOverflow", "badInput", "customError", "typeMismatch", "patternMismatch", "tooLong", "tooShort", "stepMismatch"])]),
  },
  events: {
  },
})

/**
 * <ui-field> ties the control inside it to its label and messages. The control can be any form control: a native input, or <ui-checkbox> and the others.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Group = Html.customElement({
  tag: "ui-field-group",
  properties: {
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Outside any field, a label is plain. With as-child on a native <label>, it labels the control inside it, like a card around a whole field.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Label = Html.customElement({
  tag: "ui-field-label",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-field-set>`.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Legend = Html.customElement({
  tag: "ui-field-legend",
  properties: {
  },
  events: {
  },
})

/**
 * Wraps a native <fieldset> and its <legend>, so `disabled` disables every control inside it the way the browser does.
 * @see https://ui-sdk.dev/docs/web-components/components/field
 */
export const Set = Html.customElement({
  tag: "ui-field-set",
  properties: {
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})
