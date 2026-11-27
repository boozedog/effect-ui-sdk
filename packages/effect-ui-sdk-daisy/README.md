# @boozedog/effect-ui-sdk-daisy

Optional DaisyUI theme for [`@boozedog/effect-ui-sdk`](../effect-ui-sdk). The glue package does not depend on this package, on DaisyUI, or on Tailwind. Skip this package and the bindings stay unstyled by Daisy.

Homepage: [https://boozedog.github.io/effect-ui-sdk/?style=daisy](https://boozedog.github.io/effect-ui-sdk/?style=daisy).

## Opt in

daisyUI 5 is a Tailwind plugin, not a stylesheet you can link on its own. `theme.css` is the Tailwind entry, and it **layers on top of** `@ui-sdk/core/web.css` rather than replacing it:

```css
@layer ui-sdk, theme, base, ui-sdk-theme, components, utilities, daisy-overrides;

@import "@ui-sdk/core/web.css" layer(ui-sdk-theme);
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake;
}
```

You do not load `web.css` yourself, and you do not put it in the `ui-sdk` layer: this file imports it into `ui-sdk-theme`, a layer declared **after** `base` and **before** `utilities`.

The distinction matters because `@ui-sdk/web` writes its behavior CSS as `<style>@layer ui-sdk { … }</style>` from JavaScript and **prepends** it to `<head>`. That registers `ui-sdk` before any stylesheet of yours is parsed, and a `@layer` statement never moves a layer that already exists. If `web.css` were still inside that first `ui-sdk` layer, Tailwind's preflight (`@layer base`, `* { margin: 0; padding: 0; border: 0 }`) would come after it and erase every padding, margin, and border `web.css` sets, because layers beat specificity. Importing into `ui-sdk-theme` keeps the injected behavior CSS at the bottom where it belongs, keeps `web.css` above preflight, and keeps daisyUI's `utilities` above both.

If you import `theme.css` from TypeScript *after* the UISDK component modules, that insertion order is already the situation described above, and the nested import handles it. No app-side `@layer` statement is required.

Importing the file is not enough to compile it. Vite's own CSS pipeline leaves `@theme` and `@plugin` unexpanded, so the app that loads this file needs `@tailwindcss/vite` (or another Tailwind 4 processor). The Pages site does that, and only for this stylesheet: the default build does not include Tailwind.

Tailwind v4 only generates the classes it can see, and this package scans its own source, not yours. Scan your app's source from the CSS entry that imports this one:

```css
/* src/daisy.css */
@import "@boozedog/effect-ui-sdk-daisy/theme.css";
@source ".";
```

```ts
import "./daisy.css"
import { button, checkbox } from "@boozedog/effect-ui-sdk-daisy/classes"
```

Set `document.documentElement.dataset.theme` to `light`, `dark`, or `cupcake` to pick a daisy theme. Leave it unset and daisy follows `light` / `prefers-color-scheme: dark`.

`theme.css` also fixes `color-scheme` per forced theme, unlayered, so a page stylesheet that sets `color-scheme: light dark` cannot keep native controls and `light-dark()` on the light scheme while `data-theme="dark"` is active.

The Pages site does this when the query string contains `style=daisy`, through its `src/daisy.css` entry, which imports `theme.css` and adds `@source "."` for the site's own markup. `theme=cupcake` (or `light` / `dark`) is applied only in that mode, from the nav chips. The default page, with no `style` query, keeps the UISDK `web.css` look and does not load this CSS.

## How it is layered

`theme.css` uses four mechanisms, in this order of preference:

1. **A real daisy class**, where the selector matches the element UISDK renders.
2. **A `--ui-*` bridge.** Every custom property `web.css` reads (`--ui-background`, `--ui-foreground`, `--ui-muted`, `--ui-muted-foreground`, `--ui-border`, `--ui-input`, `--ui-primary`, `--ui-primary-foreground`, `--ui-destructive`, `--ui-ring`, `--ui-ring-border`, `--ui-overlay`, `--ui-shadow`, `--ui-radius`, `--ui-spacing`, `--ui-font-size`, `--ui-line-height`, `--ui-font-sans`, `--ui-font-mono`, and the icons) is remapped to the active daisy theme. The bridge is unlayered, so it beats the values `web.css` sets inside `ui-sdk-theme`. Parts without a daisy class still follow the theme's colors, font, and depth shadow.
3. **A `daisy-overrides` layer, declared after `utilities`.** daisyUI's component rules live in `@layer utilities`, so `@layer components` (or anything earlier) cannot beat them. Only the deltas `web.css` cannot express live here: the three daisy radius roles, `--border` as a width, `--depth` inset shadows, the neutral menu highlight, and the neutral tooltip.
4. **Unlayered CSS, only for `color-scheme`** on `[data-theme]`, because a page stylesheet is unlayered and would otherwise keep winning.

There are no structural copies of `web.css` here: no checkbox box, no switch track, no slider layout, no popup padding, no `position: fixed` dialog. Those are exactly the rules that froze the old skin at 1px with no depth. The old unlayered `button.btn[data-pressed], button.btn[data-selected]` primary fill is gone too: daisyUI 5.8.3 already styles `[aria-pressed="true"]` on `.btn`, and `[aria-selected]` is a tab state, not a button state.

## What gets a daisy class

Checked against daisyUI 5.8.3's generated CSS. daisyUI 5 keys off plain elements and `aria-*` state, not the attribute names daisyUI 4 used. UISDK already sets all of them, so no state class is needed:

| daisy class | daisyUI 5.8.3 keys off | UISDK part | Applied? |
| --- | --- | --- | --- |
| `.btn` | a real `<button>`; pressed look from `aria-pressed="true"` | `button`, `toggle`, and the dialog / menu / popover / tooltip triggers | **Yes** |
| `.tabs` / `.tabs-border` | the tab row; active from `aria-selected="true"` | `ui-tabs-list` | **Yes** |
| `.tab` | `.tabs > .tab` (a direct child) | the tab `<button>` | **Class only.** UISDK wraps it in a `display: contents` `ui-tabs-tab`, so the child combinator does not match. `theme.css` re-states the two `.tabs-border` rules for `[data-slot="tabs-tab"]`. |
| `.checkbox` | `aria-checked`, not `input[type=checkbox]`; tick is `::before` | `ui-checkbox` | **Yes**, plus `checkbox-primary`. The indicator part is hidden so the tick does not double. |
| `.toggle` | an `input`, thumb is `::before` | `ui-switch` + `ui-switch-thumb` | **No.** Extra element children become grid items and fight the thumb. The tokens are copied onto the existing thumb instead. |
| `.range` | `input[type=range]` + thumb pseudo-elements | `ui-slider-track` / thumb | **No.** Tokens copied onto the track, indicator, and thumb. |
| `.select` | a native `<select>` | `[data-slot=select-trigger]` | **No.** Its surface (base-100, `--border`, 20% content hairline, `--radius-field`, depth inset) is copied onto the trigger, which is a button. |
| `.menu` | `ul.menu > li > a`, active is neutral on neutral-content | `ui-menu-item` / `ui-select-item` | **No.** The neutral highlight is applied to the items directly. |
| `.dropdown` | a wrapper whose content is `position: absolute` and hidden until focus | popover / menu / select content | **No.** It would hide and re-place UISDK's popover. |
| `.modal` | `position: fixed` + `.modal-box`, hidden until `.modal-open` | `ui-dialog-content` (already a popover) | **No.** It would force `visibility: hidden`. Box radius, `--border`, and depth are applied instead. |
| `.tooltip` | a wrapper with `data-tip`, content is a child | `ui-tooltip-content` (separate popup) | **No.** The neutral / neutral-content colors are applied instead. |
| `.collapse` | a checkbox/radio or `<details open>` | `ui-accordion` (button + `data-open`) | **No.** The trigger stays a flat full-width row with the `web.css` chevron. |

`classes.ts` exports exactly that list:

```ts
export const button = "btn btn-sm"          // action buttons only
export const tabsList = "tabs tabs-border"  // [data-slot=tabs-list]
export const tab = "tab"                    // [data-slot=tabs-tab]
export const checkbox = "checkbox checkbox-primary" // ui-checkbox
```

The other exports (`popup`, `item`, `panel`, `slider*`, `switch*`) are still there: they are markers for the parts `theme.css` styles by `[data-slot]`, and they are part of this package's API. Nothing in the theme depends on them.

Do **not** put `btn` on an accordion trigger, a collapsible trigger, or a select trigger: the first two are flat rows, and the third is a field. Do **not** put `btn` on a tab button either; `aria-selected="true"` is the active hook, and `.btn` would paint a filled pill.

## `--depth`

daisyUI themes set `--depth: 0` or `1`. The bridge turns it into `--ui-shadow`, the box shadow for popups and the dialog, so a no-depth theme gets no drop shadow without a second rule.

## License

MIT. daisyUI and Tailwind CSS are MIT-licensed dependencies of this package, not of `@boozedog/effect-ui-sdk`.
