# Better Trading

A browser extension that enhances the [pathofexile.com trade site](https://www.pathofexile.com/trade) for **Path of
Exile** and **Path of Exile 2**: saved searches, search history, pinned items and smarter result lists, right inside the
trade page.

[**Install for Chrome**](https://chrome.google.com/webstore/detail/better-pathofexile-tradin/fhlinfpmdlijegjlpgedcmglkakaghnk)
· [Firefox build](https://addons.mozilla.org/en-US/firefox/addon/better-pathofexile-trading/)

> Fan-made. Not affiliated with Grinding Gear Games in any way.

## Features

**Bookmarks** — keep your searches organised.

- Folders with custom icons (including ascendancy icons), per game version, archivable and drag-and-drop sortable
- Save the current search as a trade, mark it as completed, copy its URL, or open it as a live search
- Trades also store the search query, so they can still be opened if the site changes its URL format
  ([ADR 0001](docs/adr/0001-trades-keep-url-and-search-query.md))
- Share a folder as an export string, import one from a friend, back up and restore everything from a file

**History** — your recent searches are recorded automatically (last 50) and one click away.

**Pinned items** — pin listings from the results and keep them in view while you refine the search.

**Result enhancers** — small, individually toggleable tweaks to the results list:

- Equivalent pricings, converted using [poe.ninja](https://poe.ninja/) ratios
- Regroup similar results
- Pin button on every result

## Status: rewrite in progress

This repository is a ground-up rewrite of the original Ember.js extension on **[WXT](https://wxt.dev/) + React 19 +
TypeScript**, which also brings Firefox support back through a single codebase. The legacy code lives in
`old-extension/` (git-ignored) and is used only as a porting reference.

Not yet ported: the searched-mods highlighting and the "max sockets" warning enhancers, and the content-script UI is
still being wired together component by component (see `entrypoints/content/App.tsx`).

## Development

Requirements: Node (`lts/jod`, see [`.nvmrc`](.nvmrc)) and [pnpm](https://pnpm.io/).

```sh
pnpm install
pnpm dev           # Chromium with the extension loaded, opens the PoE trade site
pnpm dev:firefox   # same, for Firefox
pnpm storybook     # develop UI components in isolation on :6006
```

| Command                        | What it does                                 |
| ------------------------------ | -------------------------------------------- |
| `pnpm build` / `build:firefox` | Production build into `.output/`             |
| `pnpm zip` / `zip:firefox`     | Store-ready zip into `.output/`              |
| `pnpm compile`                 | Type check (`tsc --noEmit`)                  |
| `pnpm lint` / `lint:fix`       | ESLint                                       |
| `pnpm format`                  | Prettier                                     |

A husky pre-commit hook runs lint-staged and `pnpm compile`, so type errors block commits. There is no test runner yet.

### Project layout

```
entrypoints/   content script (mounts the React UI on the trade site) and background worker (poe.ninja proxy)
components/    presentational UI: index.tsx + styles.module.scss + stories, one folder each
hooks/         React hooks (bookmarks, trade history, item enhancer, storage, …)
contexts/      bookmarks and item-results state
services/      non-React logic: bookmark storage, poe.ninja, item-result enhancers
utils/         pure helpers: storage, trade-location parsing, export/backup, DOM parsing
locales/       translations (@wxt-dev/i18n); only `en` for now, more will come
docs/adr/      architecture decision records
```

Domain terms (Folder, Trade, Search Query, Export String, …) are defined in [`GLOSSARY.md`](GLOSSARY.md).

## Contributing

1. Pick or open an issue on GitHub.
2. Build UI in Storybook first. Every component needs a story, and user-visible strings must come from props/locales,
   never be hardcoded: check your component under other locales with the toolbar locale switcher.
3. Follow the lint rules (arrow functions, `import type`, `@/` alias) and make sure `pnpm lint` and `pnpm compile`
   pass.

[`CLAUDE.md`](CLAUDE.md) documents the architecture and conventions in more detail.

## Credits

Originally created by **InfaMc** ([@pboutin](https://github.com/pboutin)) and maintained by **brosmike**
([@dbjorge](https://github.com/dbjorge)).
