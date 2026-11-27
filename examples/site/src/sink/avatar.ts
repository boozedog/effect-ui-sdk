// The image is a plain `<img>`, so the source is a URL: an inline SVG data URL
// here, so the tile works offline. The toggle swaps it for an empty source,
// which is how the fallback shows without a network round-trip.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Avatar from "@boozedog/effect-ui-sdk/avatar"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

// Module scope: one string, built once. `encodeURIComponent` keeps the
// `#`, `<` and `"` out of the attribute.
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#3b82f6"/><circle cx="32" cy="23" r="11" fill="#dbeafe"/><path d="M9 64c0-12.5 10.5-20 23-20s23 7.5 23 20z" fill="#dbeafe"/></svg>`
)}`

// A source that can't decode: an error with no network round-trip, so the
// fallback shows the same way every time.
const BROKEN = "data:image/svg+xml,%3Cnot-an-image"

const Message = UiSchema.TaggedEnum({
  ChangedStatus: {
    status: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
  ToggledSource: {},
})

const Model = Schema.Struct({
  status: Schema.String,
  broken: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkAvatar",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ status: "idle", broken: false, reason: "", source: "" }),
  update: {
    ChangedStatus: ($, { status, reason, source }) => $.evolve({ status, reason, source }),
    ToggledSource: ($) => $.evolve({ broken: !$.model.broken }),
  },
  view: (h, model) =>
    tile(
      h,
      "avatar",
      "loadingstatuschange reports where the image is. A source that can't decode is an error, which leaves the fallback in place.",
      `status ${model.status}; src ${model.broken ? "broken" : "inline svg"}; ${reported(model.reason, model.source)}`,
      h.div
        .style({ display: "flex", alignItems: "center", gap: "0.75rem" })
        .children(
          Avatar.Root(h)
            .on("loadingstatuschange", ({ value, reason, source }) =>
              Message.ChangedStatus({
                status: typeof value === "string" ? value : "idle",
                reason,
                source,
              })
            )
            .children(
              h.img.attr("src", model.broken ? BROKEN : PHOTO).attr("alt", "Ada Lovelace"),
              Avatar.Fallback(h).children(
                h.span.attr("aria-hidden", "true").children("AL"),
                h.span.attr("data-slot", "visually-hidden").children("Ada Lovelace")
              )
            ),
          h.button
            .attr("type", "button")
            .class(face(h.props.daisy, classes.button))
            .on("click", () => Message.ToggledSource())
            .children(model.broken ? "Restore image" : "Break image")
        )
    ),
})

export { Definition as AvatarTile }
