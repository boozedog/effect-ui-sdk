// `page` is a live property, from 1. Previous, Next and the indicators ask it
// to move, and pagechange reports the page it moved to.
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Carousel from "@boozedog/effect-ui-sdk/carousel"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const SLIDES = ["Native scrolling", "Previous and Next", "Indicator pages"] as const

const Message = UiSchema.TaggedEnum({
  ChangedPage: {
    page: Schema.Number,
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
  name: "SinkCarousel",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ page: 1, reason: "", source: "" }),
  update: {
    ChangedPage: ($, { page, reason, source }) => $.evolve({ page, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "carousel",
      "page is the page in view, from 1. A press on Previous, Next or an indicator changes it, then pagechange reports it.",
      `page ${model.page} of ${SLIDES.length}; ${reported(model.reason, model.source)}`,
      Carousel.Root(h)
        .page(model.page)
        .on("pagechange", ({ value, reason, source }) =>
          Message.ChangedPage({ page: value, reason, source })
        )
        .children(
          Carousel.Viewport(h).children(
            Carousel.Content(h).children(
              ...SLIDES.map((slide) =>
                Carousel.Item(h).children(
                  h.div
                    .attr("data-slide", "")
                    .style({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "4rem",
                      border: "1px solid var(--ui-border)",
                      borderRadius: "var(--ui-radius)",
                      fontWeight: "600",
                    })
                    .children(slide)
                )
              )
            )
          ),
          Carousel.Previous(h).children(
            h.button
              .attr("type", "button")
              .attr("aria-label", "Previous slide")
              .class(face(h.props.daisy, classes.button))
              .children("Prev")
          ),
          Carousel.Next(h).children(
            h.button
              .attr("type", "button")
              .attr("aria-label", "Next slide")
              .class(face(h.props.daisy, classes.button))
              .children("Next")
          ),
          Carousel.IndicatorGroup(h)
            .attr("aria-label", "Choose a slide")
            .children(
              ...SLIDES.map((slide, index) =>
                Carousel.Indicator(h)
                  .page(index + 1)
                  .children(
                    h.button.attr("type", "button").attr("aria-label", slide)
                  )
              )
            )
        )
    ),
})

export { Definition as CarouselTile }
