# Third-party notices

`@boozedog/effect-ui-sdk` is MIT-licensed. It binds UI SDK's web components and
ships no UI SDK source: the generated bindings hold tag, property and event
names and short element descriptions quoted from UI SDK's own Custom Elements
Manifest.

## UI SDK

- Source: https://github.com/vercel-labs/ui
- License: Apache License 2.0 (see [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt))
- Packages: `@ui-sdk/web` (a dependency, which also supplies the
  `custom-elements.json` manifest the bindings are generated from) and
  `@ui-sdk/core` (a peer dependency, which the web components and the
  re-exported `agent`, `testing`, `observe` and `shortcuts` entry points come
  from).
- Used as: the runtime behind every tag this package binds. No UI SDK source is
  copied into this repository.

## Effect

- Source: https://github.com/Effect-TS/effect
- License: MIT
- Used as: a peer dependency. `@effect/ui` is the framework these bindings are
  written for, and `effect` supplies `Schema` and the runtime.

No code from either project is vendored here.
