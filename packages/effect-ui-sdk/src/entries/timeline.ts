// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/timeline"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * Show dated events in order, like an activity feed, a changelog or an order's progress, with arrow keys between them.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Root = Html.customElement({
  tag: "ui-timeline",
  properties: {
    orientation: Schema.Literals(["horizontal", "vertical"]),
    loop: Schema.Boolean,
    feed: Schema.Boolean,
    busy: Schema.Boolean,
    debug: Schema.Boolean,
  },
  events: {
  },
})

/**
 * Part of `<ui-timeline>`.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Connector = Html.customElement({
  tag: "ui-timeline-connector",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-timeline>`.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Description = Html.customElement({
  tag: "ui-timeline-description",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-timeline>`.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Item = Html.customElement({
  tag: "ui-timeline-item",
  properties: {
    value: Schema.String,
    status: Schema.Literals(["complete", "current", "upcoming"]),
  },
  events: {
  },
})

/**
 * Part of `<ui-timeline>`.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Marker = Html.customElement({
  tag: "ui-timeline-marker",
  properties: {
  },
  events: {
  },
})

/**
 * Binds to the `<time>` inside it, so its `datetime` stays machine readable.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Time = Html.customElement({
  tag: "ui-timeline-time",
  properties: {
  },
  events: {
  },
})

/**
 * Part of `<ui-timeline>`.
 * @see https://ui-sdk.dev/docs/web-components/components/timeline
 */
export const Title = Html.customElement({
  tag: "ui-timeline-title",
  properties: {
  },
  events: {
  },
})
