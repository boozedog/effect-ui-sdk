import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Tabs from "@boozedog/effect-ui-sdk/tabs"
import { classes, face, Props } from "./face"
import { reported, tile } from "./shell"

const TAB_IDS = ["overview", "properties", "events"] as const

const Message = UiSchema.TaggedEnum({
  ChangedTab: {
    value: Schema.NullOr(Schema.String),
    reason: Schema.String,
    source: Schema.String,
  },
})

const Model = Schema.Struct({
  tab: Schema.String,
  reason: Schema.String,
  source: Schema.String,
})

const Definition = Html.component({
  name: "SinkTabs",
  props: Props,
  model: Model,
  message: Message,
}).make({
  init: () => ({ tab: "overview", reason: "", source: "" }),
  update: {
    // `null` means nothing is selected. The Model keeps a string, so it
    // ignores that report rather than storing a value no tab has.
    ChangedTab: ($, { value, reason, source }) =>
      $.evolve({ tab: value ?? $.model.tab, reason, source }),
  },
  view: (h, model) =>
    tile(
      h,
      "tabs",
      "value is the selected tab. A click or an arrow key moves it, and valuechange reports the tab the element moved to.",
      `tab ${model.tab}; ${reported(model.reason, model.source)}`,
      Tabs.Root(h)
        .value(model.tab)
        .on("valuechange", ({ value, reason, source }) =>
          Message.ChangedTab({ value, reason, source })
        )
        .children(
          Tabs.List(h)
            .class(face(h.props.daisy, classes.tabsList))
            .attr("aria-label", "A bound tabs example")
            .children(
              ...TAB_IDS.map((id) =>
                Tabs.Tab(h)
                  .value(id)
                  .children(
                    h.button
                      .attr("type", "button")
                      .class(face(h.props.daisy, classes.button))
                      .children(id)
                  )
              )
            ),
          ...TAB_IDS.map((id) =>
            Tabs.Panel(h)
              .value(id)
              .class(face(h.props.daisy, classes.panel))
              .children(h.p.children(`The ${id} panel.`))
          )
        )
    ),
})

export { Definition as TabsTile }
