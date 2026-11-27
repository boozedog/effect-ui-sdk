# ADR-001: Effect UI ↔ UISDK Glue Layer (with DaisyUI Styling Adapter)

**Status:** Accepted  
**Date:** 2026-11-26  
**Context:** Effect UI is the new frontend foundation that continues Foldkit 0.x. UISDK provides unstyled, agent-friendly Web Components with tested keyboard, focus, selection, and ARIA behavior. We want the full UISDK surface available inside Effect UI applications without reimplementing behaviors or forcing either system to own the other’s state model. DaisyUI is the chosen styling layer.

## Decision

Create two packages:

1. **`@effect/ui-sdk` (or `effect-ui-sdk`)** — the glue layer.  
   A generated binding package that exposes UISDK’s Web Components as typed Effect UI builders via `Html.customElement`.

2. **`@effect/ui-sdk-daisy` (or similar)** — an optional, thin styling adapter.  
   Provides DaisyUI class conventions, theme variable bridges, and optional helpers. Not required to use the glue.

## Why this approach

- **Preserves both architectures.**  
  Effect UI Components own Models, updates, and composition. UISDK elements own their DOM, keyboard handling, focus, and ARIA. The Web Component boundary is the same seam Foldkit’s `CustomElement.define` and Effect UI’s `Html.customElement` already support (see Effect UI’s `examples/web-components`).

- **Generated from source of truth.**  
  Bindings are produced from `@ui-sdk/web/custom-elements.json` (the same manifest used by `foldkit-ui-sdk`). This keeps types, properties, and events in sync with UISDK without hand-maintaining 361 tags.

- **Styling is orthogonal.**  
  DaisyUI is pure CSS. It styles the light-DOM parts and state attributes (`data-pressed`, `data-open`, `data-slot`, etc.) that UISDK already exposes. The glue layer stays styling-agnostic.

## Architecture

```
Effect UI Component
  └── Model / update / view
        └── Html.customElement bindings (from @effect/ui-sdk)
              └── UISDK Web Components (<ui-toggle>, <ui-dialog>, …)
                    └── DaisyUI classes / CSS variables (optional, from @effect/ui-sdk-daisy)
```

**Property flow:** Model → element properties (controlled).  
**Event flow:** UISDK `*change` (and other) events → Effect UI Messages.  
No UISDK store lives in the Effect UI Model. No Effect UI state lives inside the custom element.

## Key design constraints (carry over from Foldkit experience)

- No server-rendered ARIA until the custom elements upgrade.
- Views receive decoded event details, not the raw `CustomEvent` (so `preventDefault` is not available from the view; controlled properties still win on the next render).
- Complex properties that the manifest cannot narrow stay `Schema.Unknown` (or equivalent).
- Registration is side-effect free until the relevant entry is imported (tree-shakable, matching UISDK’s own entry points).

## Implementation plan (for the implementing agent)

### Phase 1 – Glue layer core

1. Scaffold package that depends on `@effect/ui`, `effect`, and `@ui-sdk/web` + `@ui-sdk/core` (peer).
2. Write a generator (Node script) that reads `node_modules/@ui-sdk/web/custom-elements.json` and emits:
   - One `Html.customElement` spec per tag.
   - Namespaced exports matching UISDK’s component structure (`Toggle.Root`, `Tabs.List`, `Dialog.Content`, etc.).
   - Typed properties (as narrow as the manifest allows) and events (change events decode to `{ value, reason, source }` where applicable).
3. Provide both per-component entry points (`@effect/ui-sdk/toggle`) and a barrel that registers everything.
4. Re-export UISDK’s agent bridge, testing helpers, observe, and shortcuts so they work against the rendered tree.
5. Add a small example app (Vite) demonstrating at least Toggle, Dialog, and one composite component with full Model ↔ property ↔ event round-trips.
6. Tests that assert every tag in the manifest has a binding and that generated types match the manifest.

### Phase 2 – DaisyUI adapter

1. Thin package that depends on the glue layer + daisyUI.
2. Optional helpers or documented class conventions that map common parts/states to DaisyUI classes.
3. CSS variable bridge so DaisyUI themes apply cleanly (and can be scoped).
4. Showcase page in the example app that uses the DaisyUI adapter.

### Phase 3 – Polish

- Pin the UISDK version the generator targets.
- Document upgrade path (`pnpm generate` after bumping `@ui-sdk/web`).
- Note the known limits (SSR ARIA, no `preventDefault` from view).

## Non-goals (for v1)

- Reimplementing any UISDK behavior in pure Effect UI.
- Owning styling inside the glue layer.
- Supporting every possible third-party Web Component library (UISDK is the initial target).

## References

- Effect UI web-components example: https://github.com/Effect-TS/ui/tree/main/examples/web-components
- Foldkit reference implementation: https://github.com/roninlp/foldkit-ui-sdk
- UISDK Web Components docs: https://ui-sdk.dev/docs/web-components
- UISDK styling guide: https://ui-sdk.dev/docs/web-components/styling-and-animation
