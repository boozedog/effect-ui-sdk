/**
 * Class strings for the parts this package actually styles.
 *
 * daisyUI component classes are included only when the element matches the
 * markup those classes were written for. The other strings are hooks for
 * `theme.css`, which paints with daisy theme variables and the state
 * attributes UISDK already sets (`data-pressed`, `data-checked`, …).
 * There is no per-tag map.
 */

/**
 * The inner `<button>` that receives the behavior. daisy `.btn` matches a
 * button; it does not replace the UISDK element around it.
 */
export const button = "btn btn-sm"

/**
 * Popup surface. daisy `.modal` expects a dialog with `.modal-box`, and
 * `.dropdown` expects its own content wrapper. These parts are neither.
 */
export const popup = "effect-ui-daisy-popup"

/**
 * Menu and select item. daisy `.menu` expects `ul.menu > li > a`, and these
 * items are not that list.
 */
export const item = "effect-ui-daisy-item"

/**
 * `ui-checkbox`. daisy `.checkbox` styles `input[type=checkbox]:checked`,
 * and this element is not that input. `data-checked` is the state.
 */
export const checkbox = "effect-ui-daisy-checkbox"

/** Empty indicator part. It reads `--ui-icon`, bridged to a check in theme.css. */
export const checkboxIndicator = "effect-ui-daisy-checkbox-indicator"

/**
 * `ui-switch`. daisy `.toggle` styles an input, not this element.
 * `data-checked` is the state.
 */
export const switchRoot = "effect-ui-daisy-switch"

export const switchThumb = "effect-ui-daisy-switch-thumb"

export const slider = "effect-ui-daisy-slider"

/** Track, indicator, and thumb. daisy `.range` styles `input[type=range]`. */
export const sliderTrack = "effect-ui-daisy-slider-track"
export const sliderIndicator = "effect-ui-daisy-slider-indicator"
export const sliderThumb = "effect-ui-daisy-slider-thumb"

/**
 * Tab list. daisy `.tabs` / `.tab` expect `.tab-active`, not `data-selected`
 * on the inner button.
 */
export const tabsList = "effect-ui-daisy-tabs"

/** Accordion and collapsible panel copy. */
export const panel = "effect-ui-daisy-panel"
