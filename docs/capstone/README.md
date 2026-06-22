# Week 4 — Capstone: Build to Level 6 (Harness Engineering)

**Path A — Week 2 React portfolio.** Hardened the portfolio + live search feature with an
automated test suite and a CI / pre-commit gate that provides **backpressure**.

## Where this project sits on the 8-Level ladder

- **Before this exercise: ~Level 5.** It used tools/skills (Vite, ESLint, a custom search
  feature, MCP tools available in the Claude Code session) but had **no automated safety net** —
  nothing ran the tests automatically, and there was no CLAUDE.md.
- **After: Level 6.** Tests + lint now run automatically on every push/PR (CI) and every commit
  (pre-commit hook), and **block on failure**.

## Foundation evidence (Levels 3–5)

| Level | Evidence |
|---|---|
| **L3 / L4 — Context & Compounding** | [`CLAUDE.md`](../../CLAUDE.md) — project rules, search contract, harness commands. |
| **L5 — MCPs & Skills** | The custom **portfolio live search** feature ([`src/utils/portfolioSearch.js`](../../src/utils/portfolioSearch.js) + [`PortfolioSearchBar.jsx`](../../src/components/generic/PortfolioSearchBar.jsx)). The Claude Code session also exposes working MCP/skills (e.g. the `standup` MCP tool, Slack/Notion MCPs) used to scaffold this harness. |

## The harness (Level 6)

### (1) Automated tests — Vitest + jsdom + Testing Library

- **Unit tests** of the pure filter logic: [`src/test/portfolioSearch.test.js`](../../src/test/portfolioSearch.test.js)
  — empty/null/whitespace query, title/tag/description match, case-insensitivity, trimming,
  partial substrings, placeholder fallback, missing-locales safety, no-mutation.
- **Component tests** of the search input: [`src/test/PortfolioSearchBar.test.jsx`](../../src/test/PortfolioSearchBar.test.jsx)
  — accessible role/label, `onChange`/`onClear` callbacks, clear-button visibility, controlled value.
- **18 tests, all passing.** Run with `npm test`.

### (2) Gates that run them on every change

- **GitHub Actions CI:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs
  `npm run lint` + `npm test` on every push (main / week branches) and PR. A non-zero exit
  **blocks the check** (red ✗).
- **Pre-commit hook:** [`.githooks/pre-commit`](../../.githooks/pre-commit) runs the same gate
  locally before each commit. Enabled with `git config core.hooksPath .githooks`.
- **Bonus:** lint (ESLint) is part of the gate alongside tests.

## Backpressure demo (red → green)

The proof that the harness self-corrects without a human inspecting every step.

1. **Failure introduced on purpose:** removed `.toLowerCase()` in `filterPortfolioItems`, breaking
   case-insensitive search.
2. **Gate caught it (RED):** `1 failed | 17 passed`, `npm test` exit code **1** → CI/hook blocks.
   Full log: [`backpressure-red.txt`](./backpressure-red.txt).
3. **Fixed, gate passes (GREEN):** restored `.toLowerCase()` → `18 passed`, exit code **0**.
   Full log: [`backpressure-green.txt`](./backpressure-green.txt).

```
RED:   Tests  1 failed | 17 passed (18)   exit 1   ← gate blocks
GREEN: Tests  18 passed (18)              exit 0   ← gate passes
```

## Reflection

- **What the harness caught that a human reviewer might miss:** a one-token regression
  (dropping `.toLowerCase()`) that still *looks* correct on casual read but silently breaks
  uppercase queries — exactly the kind of subtle behavioral change a human skims past.
- **One change that moved it to Level 6:** adding an automated gate (CI + pre-commit) that runs
  the test suite on every change and blocks on failure.
- **Still verify manually:** (1) actual visual/UX of the search box and debounce on real devices;
  (2) multi-language (locale) content rendering and real JSON data loading, which the unit tests mock.
