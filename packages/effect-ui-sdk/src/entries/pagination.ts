// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/pagination"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Navigate pages with buttons, links, or your router.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Root = Html.customElement({
  tag: "ui-pagination",
  properties: {
    page: Schema.Number,
    getHref: Schema.Unknown,
    defaultPage: Schema.Number,
    pageCount: Schema.Number,
    total: Schema.Number,
    pageSize: Schema.Number,
    siblings: Schema.Number,
    boundaries: Schema.Number,
    disabled: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
    "pagechange": Schema.Struct({
      value: Schema.Number,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Ellipsis = Html.customElement({
  tag: "ui-pagination-ellipsis",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const First = Html.customElement({
  tag: "ui-pagination-first",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Item = Html.customElement({
  tag: "ui-pagination-item",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Last = Html.customElement({
  tag: "ui-pagination-last",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Link = Html.customElement({
  tag: "ui-pagination-link",
  properties: {
    page: Schema.Number,
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const List = Html.customElement({
  tag: "ui-pagination-list",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Next = Html.customElement({
  tag: "ui-pagination-next",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-pagination>`.
 * @see https://ui-sdk.dev/docs/web-components/components/pagination
 */
export const Previous = Html.customElement({
  tag: "ui-pagination-previous",
  properties: {
  },
  events: {
  },
})
