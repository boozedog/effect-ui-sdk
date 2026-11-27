# @boozedog/effect-ui-sdk-daisy

Optional DaisyUI theme for [`@boozedog/effect-ui-sdk`](../effect-ui-sdk). The glue package does not depend on this package, on DaisyUI, or on Tailwind. Skip this package and the bindings stay unstyled by Daisy.

Homepage: [https://boozedog.github.io/effect-ui-sdk/?style=daisy](https://boozedog.github.io/effect-ui-sdk/?style=daisy).

## Opt in

daisyUI 5 is a Tailwind plugin, not a stylesheet you can link on its own. `theme.css` is the Tailwind entry. Load it instead of `@ui-sdk/core/web.css`. Those two themes fight: UISDK's look and Daisy's tokens both want to paint the same parts.

Importing the file is not enough to compile it. Vite's own CSS pipeline leaves `@theme` and `@plugin` unexpanded, so the app that loads this file needs `@tailwindcss/vite` (or another Tailwind 4 processor). The Pages site does that, and only for this stylesheet: the default build does not include Tailwind.

```css
@layer ui-sdk;
@import "tailwindcss";
@plugin "daisyui";
```

`theme.css` already does that, with themes `light` (default), `dark` (`prefers-color-scheme`), and `cupcake`. The `ui-sdk` layer is declared first so these rules beat the behavior CSS UISDK injects into that layer.

Tailwind v4 only generates the classes it can see, and this package scans its own source, not yours. Scan your app's source from the CSS entry that imports this one:

```css
/* src/daisy.css */
@import "@boozedog/effect-ui-sdk-daisy/theme.css";
@source ".";
```

```ts
import "./daisy.css"
import { button, popup } from "@boozedog/effect-ui-sdk-daisy/classes"
```

Set `document.documentElement.dataset.theme` to `light`, `dark`, or `cupcake` to pick a daisy theme. Leave it unset and daisy follows `light` / `prefers-color-scheme: dark`.

The Pages site does this when the query string contains `style=daisy`, through its `src/daisy.css` entry, which imports `theme.css` and adds `@source "."` for the site's own markup. `theme=cupcake` (or `light` / `dark`) is applied only in that mode, from the nav chips. The default page, with no `style` query, keeps the UISDK `web.css` look and does not load this CSS.

## What gets a daisy class

UISDK parts render unstyled in light DOM. Style the element the UISDK docs say receives the behavior. For a toggle, button, tab, or trigger, that is the inner `<button>`, and the state attribute (`data-pressed`, `data-selected`, `data-open`) lands on that button. Do not replace the UISDK element with a daisy widget.

`classes.button` is `btn btn-sm`. daisy's `.btn` matches a `<button>`, so that class is applied there.

daisy component classes often assume daisy markup. Checked against daisyUI 5.8.3's generated CSS, these do not match the UISDK parts, so they are not applied:

| daisy class | Expects | UISDK part |
| --- | --- | --- |
| `.toggle` | an `<input>` | `ui-switch`, styled with `data-checked` |
| `.checkbox` | `input[type=checkbox]:checked` | `ui-checkbox`, styled with `data-checked` |
| `.range` | `input[type=range]` | `ui-slider-track` / thumb, positioned by UISDK |
| `.modal` | a dialog plus `.modal-box` | `ui-dialog-content` |
| `.dropdown` / `.menu` | `ul.menu > li > a`, or daisy's dropdown wrapper | `ui-menu-item` / `ui-select-item` |
| `.tabs` / `.tab` | `.tab-active` | inner tab button with `data-selected` |

Where a daisy class does not fit, `theme.css` paints that part with daisy theme variables (`--color-primary`, `--color-base-100`, `--color-base-content`, `--color-base-300`) and the UISDK state attribute. Popup content (dialog, popover, tooltip, and the select/menu surfaces in the kitchen sink) gets base background, text, radius, and border from those tokens.

A short variable bridge maps the handful of `--ui-*` custom properties those parts read (`--ui-background`, `--ui-primary`, `--ui-icon-check`, and the rest named in `theme.css`). It is not a map of every tag.

## License

MIT. daisyUI and Tailwind CSS are MIT-licensed dependencies of this package, not of `@boozedog/effect-ui-sdk`.
