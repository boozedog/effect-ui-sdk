// `value` is `readonly File[]`, so the Model holds the files themselves and
// reports their names and count. The trigger wraps your own button. Without a
// `<template>` in the list, each item falls back to the file's name and a
// remove button, which keeps the markup small.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as FileInput from "@boozedog/effect-ui-sdk/file-input"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.Array(Schema.Unknown),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.Array(Schema.Unknown),
  reason: Schema.String,
  source: Schema.String,
})

const nameOf = (file: unknown): string =>
  typeof file === "object" && file !== null && "name" in file && typeof file.name === "string"
    ? file.name
    : "(file)"

// Two names fit a tile; the rest are counted.
const namesOf = (files: ReadonlyArray<unknown>): string => {
  const names = files.slice(0, 2).map(nameOf)
  const rest = files.length - names.length
  return rest > 0 ? `${names.join(", ")} +${rest}` : names.join(", ")
}

const Definition = Html.component({
  name: "SinkFileInput",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: [], reason: "", source: "" }),
  update: {
    // A new array, so the host writes the property and the list follows it.
    ChangedValue: ($, { value, reason, source }) =>
      $.evolve({ value: value.slice(), reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "file-input",
      "value is the array of files, so the Model keeps it and reads their names. A pick, a drop, or a removal changes it, and valuechange reports what it holds.",
      `${model.value.length} file${model.value.length === 1 ? "" : "s"}${model.value.length === 0 ? "" : `: ${namesOf(model.value)}`}; ${reported(model.reason, model.source)}`,
      FileInput.Root(h)
        .value(model.value)
        .multiple(true)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedValue({ value, reason, source })
        )
        .children(
          FileInput.Dropzone(h).children(
            h.p.children("Drop files here"),
            FileInput.Trigger(h).children(
              h.button
                .attr("type", "button")
                .class(face(h.props.daisy, classes.button))
                .children("Browse files")
            )
          ),
          FileInput.List(h).attr("aria-label", "Attachments")
        )
    ),
})

export { Definition as FileInputTile }
