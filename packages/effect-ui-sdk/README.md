# @boozedog/effect-ui-sdk

Typed [Effect UI](https://effect.website) bindings for the [UI SDK](https://ui-sdk.dev)
web components. One `Html.customElement` per tag, generated from the
`custom-elements.json` manifest `@ui-sdk/web` ships.

```ts
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import * as Toggle from "@boozedog/effect-ui-sdk/toggle"

const Message = UiSchema.TaggedEnum({ ChangedPressed: { pressed: Schema.Boolean } })

Toggle.Root(h)
  .pressed(model.pressed)
  .on("pressedchange", ({ value }) => Message.ChangedPressed({ pressed: value }))
```

Importing an entry registers that entry's elements, exactly as importing
`@ui-sdk/web/<entry>` does. The barrel (`@boozedog/effect-ui-sdk`) registers
everything; a subpath keeps the rest out of the bundle.

## Requirements

`@effect/ui` needs `"strict": true` and `"exactOptionalPropertyTypes": true` in
`tsconfig.json`. The generated bindings rely on both, and the packages in this
repository set them; a consumer without them gets type errors from the Effect UI
builder types.

UI SDK declares each element in the global `HTMLElementTagNameMap` (for example
`"ui-toggle": UiToggleElement`), so `ref` and `onMount` infer the registered
`Ui*Element` type from the tag rather than plain `HTMLElement`. That needs the
`@ui-sdk/web` types in scope — importing any binding entry brings them in.

## What a binding says

`src/entries/<entry>.ts` holds one export per tag, namespaced like UI SDK names
its components: `Toggle.Root` for `ui-toggle`, `Tabs.List` for `ui-tabs-list`,
`Dialog.Content` for `ui-dialog-content`.

| Piece | What it means |
| --- | --- |
| `properties` | JavaScript properties, typed by a Schema. A property gets a method of its own unless the builder already uses the name; `id`, `class`, `style`, `key`, `ref` and `content` are set with `.prop(name, value)`, still typed. |
| `events` | A handler gets the decoded `detail`, never the `CustomEvent`. A change event decodes to `{ value, reason, source }`. An invalid detail logs and sends no message. |

The host writes a property only when it is not `===` the last value written, so
do not allocate a fresh array or object in a view for a property you expect to
skip. `value`, `checked`, `selected` and `open` are plain properties on these
elements, not controlled as on an `<input>`, and a view cannot `preventDefault`:
take the event's value into the Model instead.

## Entry points

| Import | What it is |
| --- | --- |
| `@boozedog/effect-ui-sdk` | Every binding, and so every element registered |
| `@boozedog/effect-ui-sdk/<entry>` | One component's bindings, and only its elements |
| `@boozedog/effect-ui-sdk/catalog` | Generated metadata: entries, tags, property and event names |
| `@boozedog/effect-ui-sdk/agent` | UI SDK's agent bridge, unchanged |
| `@boozedog/effect-ui-sdk/history` | UI SDK's undo/redo history helpers, unchanged |
| `@boozedog/effect-ui-sdk/testing` | UI SDK's testing kit, unchanged |
| `@boozedog/effect-ui-sdk/observe` | UI SDK's observation helpers, unchanged |
| `@boozedog/effect-ui-sdk/shortcuts` | UI SDK's shortcut manager, unchanged |

## Generated files

`src/entries/*.ts`, `src/index.ts` and `src/catalog.ts` are generated. Do not
edit them; change `scripts/generate.mjs` and run `pnpm generate`.
`pnpm check:generated` fails when the committed bindings are older than the
installed `@ui-sdk/web`.

Property and event types are as narrow as the manifest allows. Anything the
manifest describes with a generic, an element, a function or a template literal
is `Schema.Unknown`: the binding still works and the value is written as given,
it just isn't narrowed.

## Host behaviour to know

- **A refusing view does not revert the element.** The host skips a write when
  the value is `===` the last one it wrote. If a view keeps the Model at `false`
  after a press, the next render writes `false` again, the host sees no change
  and skips it, and the element stays `true` until the Model changes to
  something else. Accept the reported value.
- **Omitting a declared property resets it** to `""`, `false` or `null`.
- **`api` and `controller` are not bound.** They are handles the element owns;
  a view writing one would fight the controller inside it.

## Styling

This package does not depend on a theme. `@boozedog/effect-ui-sdk-daisy` is an
optional adapter in this repository. Skip it and the bindings stay unstyled by
DaisyUI. Do not import that package from here.
