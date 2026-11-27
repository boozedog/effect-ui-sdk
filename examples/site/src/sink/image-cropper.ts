// `crop` is an object in the image's own pixels, and the binding types it as
// unknown, so the Model holds it as is and the readout guards its shape. The
// source is an inline SVG data URL, so the tile works offline.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as ImageCropper from "@boozedog/effect-ui-sdk/image-cropper"
import { Props } from "./face"
import { reported, tile } from "./shell"

const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><circle cx="460" cy="150" r="56" fill="#fafafa"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#262626"/></svg>`
)}`

const HANDLES = ["nw", "ne", "sw", "se"] as const

const Message = UiSchema.TaggedEnum({
  ChangedCrop: {
    crop: Schema.Unknown,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  crop: Schema.Unknown,
  reason: Schema.String,
  source: Schema.String,
})

const read = (crop: unknown): string => {
  if (typeof crop !== "object" || crop === null) return "no crop yet"
  const { x, y, width, height } = crop as Record<string, unknown>
  if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") {
    return "no crop yet"
  }
  return `${Math.round(width)}x${Math.round(height)} at ${Math.round(x)}, ${Math.round(y)}`
}

const Definition = Html.component({
  name: "SinkImageCropper",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ crop: null, reason: "", source: "" }),
  update: {
    ChangedCrop: ($, { crop, reason, source }) => $.evolve({ crop, reason, source }),
  },
  view: (h, model) => {
    // The element's `crop` property crashes on `null` (it dereferences the
    // value), so it's only written once the first cropchange has landed. Until
    // then the element owns the crop and measures its own default.
    const root = ImageCropper.Root(h)
      .attr("aria-label", "Profile image cropper")
      .src(PHOTO)
      .aspectRatio(16 / 9)
      .minWidth(64)
      .minHeight(64)
      .on("cropchange", ({ value, reason, source }) =>
        Message.ChangedCrop({ crop: value, reason, source })
      )

    return tile(
      h,
      "image-cropper",
      "crop is the kept box in the image's own pixels. A drag on the selection or a handle changes it, and cropchange reports the box it moved to.",
      `${read(model.crop)}; ${reported(model.reason, model.source)}`,
      (model.crop === null ? root : root.crop(model.crop)).children(
        ImageCropper.Viewport(h)
          // The viewport's own ratio follows the image; a fixed height keeps
          // the tile compact, so its aspect ratio is turned off here.
          .style({ height: "9rem", aspectRatio: "auto" })
          .children(
            ImageCropper.Image(h).children(
              h.img.attr("alt", "Mountains at sunset")
            ),
            ImageCropper.Selection(h).children(ImageCropper.Grid(h)),
            ...HANDLES.map((position) =>
              ImageCropper.Handle(h).position(position)
            )
          )
      )
    )
  },
})

export { Definition as ImageCropperTile }
