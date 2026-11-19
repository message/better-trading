# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Better Trading: a browser extension for the pathofexile.com trade site (PoE 1 and 2), being rewritten from Ember.js
to WXT + React 19 + TypeScript. The legacy Ember code lives in `old-extension/` (git-ignored, excluded from
`tsc` and ESLint) and serves only as a porting reference; do not edit it. `README.md` is still the WXT template.

## Commands

Package manager is pnpm (Node `lts/jod`, see `.nvmrc`).

- `pnpm dev` / `pnpm dev:firefox` — WXT dev mode (opens Chromium on `https://www.pathofexile.com/trade`)
- `pnpm build` / `pnpm zip` (add `:firefox` variants) — production build / store zip into `.output/`
- `pnpm storybook` — Storybook on :6006; the primary way to develop UI components in isolation
- `pnpm compile` — `tsc --noEmit` type check
- `pnpm lint` / `pnpm lint:fix`, `pnpm format` / `pnpm format:check`

**Non-TTY shells (agents, scripts):** run `wxt`, `pnpm` and `git commit` (its hook calls pnpm) as
`CI=true timeout 20 <cmd> < /dev/null`. Without `CI=true`, Vite 7 watches stdin: a closed stdin makes `wxt build`
exit 0 mid-build with an empty `.output/`, and a never-closing one makes `wxt prepare` (the `postinstall`) hang.

- `pnpm test` / `pnpm test:watch` — vitest (`vitest.config.ts`, WXT's vitest plugin). Tests sit next to the code
  as `*.test.ts`; today they cover `services/pob/` (ported from the pob2bt CLI) with Build Code fixtures in
  `services/pob/fixtures/`. Work test-first there: add a failing test for the behavior, then change the code.

The husky pre-commit hook runs `lint-staged` (prettier + eslint --fix) and then `pnpm compile`, so type errors block
commits. It does not run the tests.

## Architecture

**Entrypoints** (`entrypoints/`):
- `content/` — content script injected on all PoE trade domains; mounts a React root via WXT `createIntegratedUi`
  into `body` (`#better-trading-container`). `App.tsx` is still a placeholder: components are not wired in yet.
- `background.ts` — service worker. Its only job is proxying `poe.ninja` API requests
  (`{ query: 'poe-ninja', resource }` message) because content scripts can't fetch cross-origin. Called via
  `utils/extension-background.ts` from `services/poe-ninja.ts`.

**Layers** (all imported with the `@/` alias, e.g. `@/hooks/useBookmarks`):
- `components/<Name>/index.tsx` + `styles.module.scss` + `<Name>.stories.tsx` — presentational UI. Page-level
  components (`Page*`) get **all user-visible strings as props** (labels, messages), not from i18n internally;
  stories supply them per locale via `.storybook/locale-utils.ts` (`defineMessages` / `resolveLocaleValue`).
  Real strings go in `locales/en.yml` (`@wxt-dev/i18n`).
- `hooks/` — React hooks; `useBookmarks` is a thin wrapper over `BookmarksContext`.
- `contexts/` — `BookmarksContext` holds `folders` state and wraps `services/bookmarks/storage`, refreshing state
  after every mutation; `ItemResultsContext` wires the enhancer services and pinned items.
- `services/` — non-React logic: `bookmarks/storage.ts` (persistence), `poe-ninja.ts` (chaos ratios, cached 1 h) and `item-results/enhancers/*`
  (pinnable, equivalent-pricings, regroup-similars) implementing `ItemResultsEnhancerService` from `types/item-results.ts`.
- `utils/` — pure helpers (storage, trade-location parsing, bookmark export/backup, DOM item parsing).
- `types/` — shared types (`*Struct` naming for persisted shapes).

**Item enhancement flow**: `useItemEnhancer` runs a `MutationObserver` on the trade site's `#trade` element,
finds un-enhanced `.resultset > div.row[data-id]` rows (marked with the `bt-enhanced` attribute afterwards), and
runs each enhancer's `initialize` → `prepare` → `enhance` (per item) / `clear`, sequentially through a promise
queue. Enhancers can be disabled by `slug`.

**Storage**: `utils/storage.ts` wraps `localStorage` with the `bt-` key prefix and optional expiry
(`{ value, expiresAt }`) and degrades to no-op if unavailable; `hooks/useStorage.ts` is its React binding.
Trade history (`hooks/useTradeHistory.ts`, max 50 entries) is stored through it.

**Storybook mocking**: components must run in Storybook without extension APIs. `.storybook/mock-providers.tsx`
provides mock context providers (e.g. `MockTradeHistoryProvider`) and components pick them up via
`useMockable*` hooks, falling back to the real hook. This branch (`feature/service-layer`) is moving toward a
service layer that replaces these per-component `services-stub.ts` files; check the current state of that
migration before adding new stubs.

## Conventions

ESLint enforces (see `eslint.config.ts`): arrow-function expressions only (`func-style`), `import type` for
type-only imports, a specific `import-x/order` (index → sibling → parent → `@/` internal → external → builtin →
type), and `export` statements last in the file. Prettier: single quotes, no parens on single-arg arrows,
120 columns, trailing commas. Styles are SCSS modules; global trade-site tweaks live in `styles/globals/`.
SVG icons in `assets/icons/` are imported as React components through `vite-plugin-svgr` (`modules/svgr.ts`).

**Every new component needs a Storybook story** (`<Name>.stories.tsx` next to it). Stories must work with the
Storybook locale switcher (toolbar `locale` global, see `.storybook/preview.tsx`): supply user-visible strings per
locale via `defineMessages` / `resolveLocaleValue` from `.storybook/locale-utils.ts`, and check the component under
other locales, because fonts and text length change per language. Only `en` exists in `locales/` today, but more
languages WILL be added, so never assume English-only layout or hardcode strings in components.

**Port, don't copy.** When migrating something from `old-extension/`, review the old solution first: keep it if it
worked well, redesign it if there is a clearly better approach. Parity is about behavior, not about code structure.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `message/better-trading` (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
