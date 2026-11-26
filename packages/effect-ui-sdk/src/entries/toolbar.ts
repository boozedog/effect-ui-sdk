// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/toolbar"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Give buttons, toggles, menus and fields one tab stop with arrow-key navigation.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Root = Html.customElement({
  tag: "ui-toolbar",
  properties: {
    orientation: Schema.Literals(["horizontal", "vertical"]),
    loop: Schema.Boolean,
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-toolbar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Button = Html.customElement({
  tag: "ui-toolbar-button",
  properties: {
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-toolbar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Group = Html.customElement({
  tag: "ui-toolbar-group",
  properties: {
    disabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-toolbar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Input = Html.customElement({
  tag: "ui-toolbar-input",
  properties: {
    disabled: Schema.Boolean,
    focusableWhenDisabled: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-toolbar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Link = Html.customElement({
  tag: "ui-toolbar-link",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-toolbar>`.
 * @see https://ui-sdk.dev/docs/web-components/components/toolbar
 */
export const Separator = Html.customElement({
  tag: "ui-toolbar-separator",
  properties: {
  },
  events: {
  },
})
