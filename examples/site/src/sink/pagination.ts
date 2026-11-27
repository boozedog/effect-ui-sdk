import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Pagination from "@boozedog/effect-ui-sdk/pagination"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

// `page` is the current page and `page-count` its last. Written-out links take
// their own `page` attribute, which the element compares with the current one.
const PAGES = [1, 2, 3, 4, 5] as const

const Message = UiSchema.TaggedEnum({
  ChangedPage: {
    value: Schema.Number,
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  page: Schema.Number,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkPagination",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ page: 1, reason: "", source: "" }),
  update: {
    ChangedPage: ($, { value, reason, source }) => $.evolve({ page: value, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "pagination",
      "page is the current page and page-count the last. A link you write yourself takes its own page attribute, and pagechange reports the page the element moved to.",
      `page ${model.page}; ${reported(model.reason, model.source)}`,
      Pagination.Root(h)
        .page(model.page)
        .pageCount(PAGES.length)
        .attr("aria-label", "Pagination")
        .on("pagechange", ({ value, reason, source }) =>
          Message.ChangedPage({ value, reason, source })
        )
        .children(
          Pagination.List(h).children(
            Pagination.Item(h).children(
              Pagination.Previous(h).children(
                h.button.attr("type", "button").children("Prev")
              )
            ),
            ...PAGES.map((page) =>
              Pagination.Item(h).children(
                Pagination.Link(h)
                  .page(page)
                  .children(h.button.attr("type", "button").children(String(page)))
              )
            ),
            Pagination.Item(h).children(
              Pagination.Next(h).children(
                h.button.attr("type", "button").children("Next")
              )
            )
          )
        )
    ),
})

export { Definition as PaginationTile }
