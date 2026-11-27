// The viewport is the real scroller, so give the root a height. The button
// appends a row, which is the only Model state this tile needs.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as ScrollArea from "@boozedog/effect-ui-sdk/scroll-area"
import { classes, face, Props } from "./face"
import { tile } from "./shell"

const START = [
  "Inbox",
  "Drafts",
  "Sent",
  "Archive",
  "Spam",
  "Trash",
  "Updates",
  "Promotions",
  "Social",
  "Forums",
  "Receipts",
  "Travel",
] as const

const Message = UiSchema.TaggedEnum({
  Appended: {},
})

const Model = Schema.Struct({
  count: Schema.Number,
})

const Definition = Html.component({
  name: "SinkScrollArea",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ count: START.length }),
  update: {
    Appended: ($) => $.evolve({ count: $.model.count + 1 }),
  },
  view: (h, model) =>
    tile(
      h,
      "scroll-area",
      "The viewport scrolls natively; the scrollbar and its thumb are the parts this element paints. A row appended past the height starts to scroll.",
      `rows ${model.count}`,
      h.div
        .style({ display: "grid", gap: "0.5rem" })
        .children(
          ScrollArea.Root(h)
            .attr("data-testid", "scroll-area")
            .style({ height: "6rem", fontSize: "0.75rem" })
            .children(
              ScrollArea.Viewport(h)
                .attr("role", "region")
                .attr("aria-label", "Folders")
                .children(
                  ScrollArea.Content(h).children(
                    h.ul
                      .style({ margin: "0", padding: "0", listStyle: "none" })
                      .children(
                        ...Array.from({ length: model.count }, (_, index) =>
                          h.li
                            .key(String(index))
                            .style({ padding: "0.125rem 0" })
                            .children(
                              `${START[index] ?? "Folder"} ${index + 1}`
                            )
                        )
                      )
                  )
                ),
              ScrollArea.Scrollbar(h)
                .orientation("vertical")
                .children(ScrollArea.Thumb(h))
            ),
          h.button
            .attr("type", "button")
            .class(face(h.props.daisy, classes.button))
            .on("click", () => Message.Appended())
            .children("Append a folder")
        )
    ),
})

export { Definition as ScrollAreaTile }
