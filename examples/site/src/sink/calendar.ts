// The selection and the displayed month are separate controlled properties.
// value is an ISO date for mode "single", and month names the first month
// shown, like "2026-11".
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Calendar from "@boozedog/effect-ui-sdk/calendar"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const Message = UiSchema.TaggedEnum({
  ChangedValue: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
  ChangedMonth: {
    month: Schema.String,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  value: Schema.NullOr(Schema.String),
  month: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const dateOf = (value: unknown): string | null | undefined => {
  if (value === null) return null
  return typeof value === "string" ? value : undefined
}

const Definition = Html.component({
  name: "SinkCalendar",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ value: "2026-11-27", month: "2026-11", reason: "", source: "" }),
  update: {
    ChangedValue: ($, { value, reason, source }) => $.evolve({ value, reason, source }),
    ChangedMonth: ($, { month, reason, source }) => $.evolve({ month, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "calendar",
      "value is the selected date and month is the first month shown. They move independently, so the arrows turn the page without changing the selection.",
      `value ${model.value ?? "(none)"}; month ${model.month}; ${reported(model.reason, model.source)}`,
      Calendar.Root(h)
        .mode("single")
        .value(model.value)
        .month(model.month)
        .on("valuechange", ({ value, reason, source }) => {
          const next = dateOf(value)
          return next === undefined ? undefined : Message.ChangedValue({ value: next, reason, source })
        })
        .on("monthchange", ({ value, reason, source }) =>
          Message.ChangedMonth({ month: value, reason, source })
        )
        .children(
          h.div.attr("data-slot", "row").children(
            Calendar.Previous(h),
            Calendar.Heading(h),
            Calendar.Next(h)
          ),
          // Without a template, the calendar renders a weekday header and a
          // day for each cell it fills in itself.
          Calendar.Grid(h).children(
            Calendar.Weekdays(h),
            Calendar.Weeks(h)
          )
        )
    ),
})

export { Definition as CalendarTile }
