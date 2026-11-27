/**
 * Class strings for the daisyUI parts the UISDK markup actually matches, plus
 * the marker classes the sink uses.
 *
 * Verified against daisyUI 5.8.3's generated CSS. Those components key off
 * plain elements and `aria-*` state, not the attribute names daisyUI 4 used:
 * `.btn` reacts to `aria-pressed="true"`, `.checkbox` to
 * `aria-checked="true"`, `.tab` to `aria-selected="true"`. UISDK already sets
 * every one of them, so no extra state hooks are needed.
 *
 * Everything else (popups, items, switches, sliders, selects) is painted by
 * `theme.css` from the part's `[data-slot]` and the daisy tokens, because the
 * daisy class for those parts expects markup UISDK does not render
 * (`.modal-box`, `ul.menu > li > a`, `input[type=checkbox]`,
 * `input[type=range]`, a native `<select>`), and several of them set
 * `display`, `visibility`, or `position` that would break the widget. The
 * `effect-ui-daisy-*` strings below are markers for those parts; the theme does
 * not need them, so they are optional in markup.
 */

/**
 * A real action button: `button`, `toggle`, and the dialog, menu, popover, and
 * tooltip triggers. Not the accordion or collapsible triggers (those stay flat
 * full-width rows with a chevron) and not the select trigger (that is a field,
 * and `theme.css` paints it like daisy `.select`).
 */
export const button = "btn btn-sm"

/**
 * The tab list. `.tabs` lays out the row and `.tabs-border` draws the 3px bar
 * under the selected tab. daisy's selector is `.tabs > .tab`, and UISDK wraps
 * each tab button in a `display: contents` `ui-tabs-tab` part, so that child
 * combinator never matches. `theme.css` re-states the two `.tabs-border` rules
 * for `[data-slot="tabs-tab"]` in its post-utilities layer for that reason.
 */
export const tabsList = "tabs tabs-border"

/**
 * The tab button. `aria-selected="true"` is already the active hook daisyUI
 * 5.8.3 reads. Do not also put `btn` on it: `.btn` is a filled control, and a
 * daisy tab is a flat row with a bar under it.
 */
export const tab = "tab"

/**
 * `ui-checkbox`. daisy `.checkbox` keys off `aria-checked`, not
 * `input[type=checkbox]`, so it applies to the host as-is.
 * `checkbox-primary` sets `--input-color`, the checked fill. daisy draws the
 * tick with `::before`, so `theme.css` hides UISDK's indicator part or the
 * mark would show twice.
 */
export const checkbox = "checkbox checkbox-primary"

/** Marker for a popup surface: dialog, popover, tooltip, menu, select. */
export const popup = "effect-ui-daisy-popup"

/** Marker for a menu or select item. */
export const item = "effect-ui-daisy-item"

/** Marker for accordion, collapsible, and tabs panel copy. */
export const panel = "effect-ui-daisy-panel"

/**
 * Marker for `ui-checkbox`'s indicator part. It stays empty in the daisy
 * theme: `.checkbox::before` is the only checkmark, and `theme.css` hides this
 * part while `.checkbox` is present.
 */
export const checkboxIndicator = "effect-ui-daisy-checkbox-indicator"

/** Markers for `ui-switch` and its thumb. daisy `.toggle` is an input. */
export const switchRoot = "effect-ui-daisy-switch"
export const switchThumb = "effect-ui-daisy-switch-thumb"

/**
 * Markers for `ui-slider` and its parts. daisy `.range` is an
 * `input[type=range]`, so its thumb and track pseudo-elements are not these.
 */
export const slider = "effect-ui-daisy-slider"
export const sliderTrack = "effect-ui-daisy-slider-track"
export const sliderIndicator = "effect-ui-daisy-slider-indicator"
export const sliderThumb = "effect-ui-daisy-slider-thumb"
