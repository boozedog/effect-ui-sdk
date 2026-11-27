// The field holds the date and the trigger opens the calendar. The popup
// starts closed, and value is an ISO date. The Calendar parts work inside the
// content because the Date Picker import defines them too.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Calendar from "@boozedog/effect-ui-sdk/calendar"
import * as DatePicker from "@boozedog/effect-ui-sdk/date-picker"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedOpen: {
    open: Schema.Boolean,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  open: Schema.Boolean,
  reason: Schema.String,
  source: Schema.String,
})

const dateOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkDatePicker",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "2026-11-27", open: false, reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedOpen: ($, { open, reason, source }) => $.evolve({ open, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "date-picker",
      "The field takes a typed date and the trigger opens a Calendar for the same value. openchange reports whether the popup is open.",
      `value ${model.value ?? "(none)"}; open ${model.open}; ${reported(model.reason, model.source)}`,
      DatePicker.Root(h)
        .mode("single")
        .value(model.value)
        .open(model.open)
        .on("valuechange", ({ value, reason, source }) => {
          const next = dateOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .on("openchange", ({ value, reason, source }) =>
          Message.ChangedOpen({ open: value, reason, source })
        )
        .children(
          h.div.attr("data-slot", "row").children(
            DatePicker.Input(h).children(
              h.input.attr("aria-label", "Due date").attr("placeholder", "YYYY-MM-DD")
            ),
            // The trigger sits inside the field, and the theme draws its
            // calendar icon, so it stays an empty button rather than taking the
            // action button face.
            DatePicker.Trigger(h).children(
              h.button.attr("type", "button").attr("aria-label", "Choose a date")
            )
          ),
          DatePicker.Content(h)
            .class(face(h.props.daisy, classes.popup))
            .children(
              h.div.attr("data-slot", "row").children(
                Calendar.Previous(h),
                Calendar.Heading(h),
                Calendar.Next(h)
              ),
              // Without a template, the calendar fills the grid with the
              // weekday headers and a day for each cell itself.
              Calendar.Grid(h).children(
                Calendar.Weekdays(h),
                Calendar.Weeks(h)
              )
            )
        )
    ),
})

export { Definition as DatePickerTile }
