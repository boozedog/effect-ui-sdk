# Effect UI SDK bindings

Typed [Effect UI](https://effect.website) bindings for the [UI SDK](https://ui-sdk.dev)
web components, generated from the `custom-elements.json` manifest that
`@ui-sdk/web` ships.

```ts
import { Html } from "@effect/ui/html"
import { Toggle } from "@boozedog/effect-ui-sdk"

Toggle.Root(h)
  .pressed(model.pressed)
  .on("pressedchange", ({ value }) => Message.ChangedPressed({ pressed: value }))
```

Each tag becomes one `Html.customElement` binding, namespaced the way UI SDK
names its components (`Toggle.Root`, `Tabs.List`, `Dialog.Content`). Properties
are typed as narrowly as the manifest allows and fall back to `Schema.Unknown`,
and change events decode to `{ value, reason, source }`.

Importing an entry registers its elements, because that is what `@ui-sdk/web`
does. `@boozedog/effect-ui-sdk` is a binding layer only: it holds no
behaviour, no markup and no styling. A styling adapter can sit on top of it.

Homepage: [https://boozedog.github.io/effect-ui-sdk/](https://boozedog.github.io/effect-ui-sdk/).

- [Catalog](https://boozedog.github.io/effect-ui-sdk/?view=catalog) lists every binding. The homepage with no query is the same page.
- [Kitchen Sink](https://boozedog.github.io/effect-ui-sdk/?view=sink) shows one tile per entry. `?only=` filters either view.

## Packages

| Path | What it is |
| --- | --- |
| `packages/effect-ui-sdk` | `@boozedog/effect-ui-sdk`, the bindings |
| `examples/site` | The catalog and kitchen sink site, built with Vite |

## Working in the repository

```bash
pnpm install
pnpm generate        # Rewrite packages/effect-ui-sdk/src/entries
pnpm check:generated # Fail when the generated bindings are stale
pnpm typecheck
pnpm test
pnpm dev             # The catalog site (`?view=catalog`, kitchen sink at `?view=sink`)
```

`src/entries` and `src/namespaces.ts` are generated. Do not edit them; change
`packages/effect-ui-sdk/scripts/generate.mjs` and run `pnpm generate` after
bumping `@ui-sdk/web`.

## License

MIT. UI SDK is Apache-2.0 and is used as a dependency and as the manifest the
bindings are generated from; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
