# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## Project

A React + Bootstrap 5 single-page developer portfolio (Vite-bundled), forked from
Ryan Balieiro's template and personalized. Content is **data-driven**: all copy lives in
JSON under `public/data/` (profile, settings, sections), so UI components render from data
rather than hardcoded strings.

The headline custom feature is a **live portfolio search** (debounced) that filters
project items by title, tags, and description.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint over the repo (0 errors required; warnings tolerated) |
| `npm test` | Run the Vitest suite once (`vitest run`) |

## Architecture

- `src/main.jsx` — entry; mounts `Portfolio` wrapped in context providers.
- `src/providers/` — React context providers (Data, Language, Theme, Viewport, Navigation, …).
  `DataProvider` loads the JSON in `public/data/` and exposes `getProfile/getSettings/getSections`.
- `src/components/` — UI. Sections render via `components/articles/*` (e.g. `ArticlePortfolio.jsx`).
- `src/components/generic/PortfolioSearchBar.jsx` — the search input (controlled, accessible).
- `src/utils/portfolioSearch.js` — **pure** filter logic (`filterPortfolioItems`). Keep search
  logic here, framework-free, so it stays unit-testable.
- `src/hooks/` — utilities and data model wrappers (`ArticleDataWrapper`, parsers, etc.).
- `public/data/` — all editable content. Changing the portfolio = editing JSON, not JSX.

## Search feature contract

`filterPortfolioItems(items, query)`:
- Empty / null / whitespace query → returns all items unchanged.
- Otherwise case-insensitive substring match against `locales.title` (fallback `placeholder`),
  `locales.text`, and `locales.tags[]`.
- Must remain a pure function (no React, no DOM) — this is what the unit tests cover.

The UI debounces input by 300ms (`ArticlePortfolio.jsx`) before calling the filter, and
announces result counts via an `aria-live` region.

## Conventions

- Indentation: 4 spaces. ES modules (`"type": "module"`).
- Keep business/filter logic out of components and in `src/utils/` so it can be tested.
- Tests live in `src/test/` and run under Vitest + jsdom + Testing Library.
- Accessibility matters: search controls have labels, `role="search"`, and live regions —
  preserve these when editing.

## Harness / CI (Level 6)

- **Tests must pass**: `npm test` is the backpressure gate for the search feature.
- **Lint must have 0 errors**: `npm run lint`.
- CI (`.github/workflows/ci.yml`) runs lint + test on every push and PR and **blocks on failure**.
- A pre-commit hook (`.githooks/pre-commit`, enabled via `git config core.hooksPath .githooks`)
  runs the same gate locally before each commit.
- Before claiming a change works, run `npm run lint && npm test`.
