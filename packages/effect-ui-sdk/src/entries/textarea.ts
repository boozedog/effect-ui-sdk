// Generated from @ui-sdk/web/custom-elements.json by scripts/generate.mjs.
// Do not edit. Run `pnpm generate` after upgrading @ui-sdk/web.
import "@ui-sdk/web/textarea"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

/**
 * <ui-input> and <ui-textarea> wrap a native field. They mark it `data-filled` and fire `valuechange` with a reason. Put them in a <ui-field> to wire the field to its label and messages.
 * @see https://ui-sdk.dev/docs/web-components/components/textarea
 */
export const Root = Html.customElement({
  tag: "ui-textarea",
  properties: {
    value: Schema.String,
    defaultValue: Schema.String,
    autoResize: Schema.Boolean,
    submitShortcut: Schema.Literals(["enter", "mod+enter"]),
    debug: Schema.Boolean,
  },
  events: {
    "valuechange": Schema.Struct({
      value: Schema.String,
      reason: Schema.String,
      source: Schema.String,
    }),
  },
})
