import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Drawer from "@boozedog/effect-ui-sdk/drawer"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

// A drawer is a dialog that drags. `open` is the same bound property, and
// `openchange` reports the same shape, with `swipe` among the reasons.
const Message = UiSchema.TaggedEnum({
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkDrawer",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ open: false, reason: "", source: "" }),
  update: {
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "drawer",
      "A drawer is a dialog that drags. open is the element's property, the handle resizes it, and Escape, a press outside or a drag toward the edge asks it to close.",
      `open ${model.open}; ${reported(model.reason, model.source)}`,
      Drawer.Root(h)
        .open(model.open)
        .side("bottom")
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          Drawer.Trigger(h).children(
            h.button
              .attr("type", "button")
              .class(face(h.props.daisy, classes.button))
              .children(model.open ? "Sheet is open" : "Open sheet")
          ),
          // The backdrop is a real part, so it has to be rendered.
          Drawer.Backdrop(h),
          Drawer.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              // The handle wraps a native button that names itself.
              Drawer.Handle(h).children(h.button.attr("aria-label", "Resize")),
              Drawer.Title(h).children("Move goal"),
              Drawer.Description(h).children("Set a daily activity goal."),
              Drawer.Close(h).children(
                h.button
                  .attr("type", "button")
                  .class(face(h.props.daisy, classes.button))
                  .children("Close")
              )
            )
        )
    ),
})

export { Definition as DrawerTile }
