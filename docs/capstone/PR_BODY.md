## Week 4 — Capstone: Build to Level 6

### Task path

- [ ] **Default** — Week 3 N8N standup bot
- [x] **A** — Week 2 React portfolio
- [ ] **B** — Real work project: _name it_

### Current level

- **Project:** React + Bootstrap portfolio with a live (debounced) search feature
- **Current level on the 8-Level ladder (before this exercise):** ~Level 5 (uses tools/skills — Vite, ESLint, a custom search feature, MCP tools in the Claude Code session — but had **no automated safety net** and no `CLAUDE.md`)
- **Target:** at least Level 6 (Harness Engineering) ✅

### Foundation evidence (Levels 3–5)

- **L3/L4 — Context & Compounding:** [`CLAUDE.md`](../../CLAUDE.md) — project rules, search-feature contract, harness commands.
- **L5 — MCPs & Skills:** the custom **portfolio live search** ([`src/utils/portfolioSearch.js`](../../src/utils/portfolioSearch.js) + [`PortfolioSearchBar.jsx`](../../src/components/generic/PortfolioSearchBar.jsx)); the Claude Code session also exposes working MCP/skills (`standup` MCP, Slack/Notion MCPs) used to scaffold this harness.

### Harness build (Level 6)

- **(1) Tests / validation added:**
  - Framework / approach: **Vitest** + jsdom + Testing Library
  - What they cover: pure search filter (empty/null/whitespace, title/tag/description match, case-insensitivity, trimming, partial substrings, placeholder fallback, missing-locales safety, no-mutation) + the `PortfolioSearchBar` component (accessible role/label, onChange/onClear, clear-button visibility, controlled value)
  - Files: [`src/test/portfolioSearch.test.js`](../../src/test/portfolioSearch.test.js), [`src/test/PortfolioSearchBar.test.jsx`](../../src/test/PortfolioSearchBar.test.jsx)
  - Passing? [x] Yes — **18 tests pass**
- **(2) Gate that runs on every change:**
  - [x] GitHub Actions CI workflow: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) (lint + test on push/PR)
  - [x] Pre-commit hook: [`.githooks/pre-commit`](../../.githooks/pre-commit) (`git config core.hooksPath .githooks`)
  - What happens on failure: non-zero exit code → CI check goes red ✗ and the commit is blocked locally; the change cannot merge until fixed.

### Backpressure demo (red → green)

- **Failure I introduced on purpose:** removed `.toLowerCase()` in `filterPortfolioItems`, breaking case-insensitive search.
- **Gate caught it (RED):** `Tests 1 failed | 17 passed (18)`, `npm test` exit code **1**. Log: [`docs/capstone/backpressure-red.txt`](backpressure-red.txt)
- **Fixed, gate passes (GREEN):** restored `.toLowerCase()` → `Tests 18 passed (18)`, exit code **0**. Log: [`docs/capstone/backpressure-green.txt`](backpressure-green.txt)

### Bonus (optional)

- [x] Lint / type-check in the gate (ESLint runs in CI and pre-commit alongside tests)
- [ ] Logging / observability on the agent

### Acceptance criteria

- [x] 1. Project + path chosen; current level stated, targeting Level 6
- [x] 2. L3/L4 evidence: `CLAUDE.md` present (linked)
- [x] 3. L5 evidence: working tool/skill named and shown (live search)
- [x] 4. Harness part 1: automated tests added and passing (files linked)
- [x] 5. Harness part 2: CI gate + pre-commit hook run them automatically
- [x] 6. Backpressure demonstrated: red then green, both captured
- [x] 7. (Bonus) lint in the gate
- [ ] 8. (Optional — L7) background agent
- [ ] 9. (Optional — L8) agent teams

### Reflection

- **What the harness caught that a human reviewer might miss:** a one-token regression (dropping `.toLowerCase()`) that reads as correct but silently breaks uppercase queries.
- **Which level before, what moved it to Level 6:** was ~L5; adding an automated gate (CI + pre-commit) that runs the suite on every change and blocks on failure moved it to L6.
- **Would still verify manually:** (1) real-device search UX + 300ms debounce feel; (2) multi-language locale rendering and live JSON data loading (mocked in unit tests).

### 60-second share

My React portfolio's live search now has a Vitest suite gated by GitHub Actions + a pre-commit hook | the harness catches subtle behavioral regressions like a dropped `.toLowerCase()` before they merge | I'd still check the debounce feel and multi-language rendering by hand.
