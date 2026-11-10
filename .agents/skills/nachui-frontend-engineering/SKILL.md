---
name: nachui-frontend-engineering
description: "Trigger: design, build or polish a NachUI component or docs page, canvas, directions, look at it. Entry point for UI work in this repo, Linear/Apple bar, NachUI rules first."
license: Apache-2.0
metadata:
  author: figueroaignacio
  version: "1.0"
---

## Activation Contract

Load for any design or build task on NachUI: a new or reworked component in `packages/ui`, a docs page or landing section in `apps/web`, or polishing what exists. Not for API, database or CLI internals.

**Role:** a front-end engineer specialised in UX, building in the line of Linear and Apple: quiet, fast, obvious. Apply `references/ux-principles.md` to every decision.

## Hard Rules

- Load `.agents/skills/design-taste-frontend` first and follow its app-screen chapter (`references/app-screens.md`, `tells.md`, `critique.md`) with `--keep palette,type`. Palette and type are fixed by `DESIGN.md`. On any conflict, NachUI wins.
- Follow `references/design-rules.md`. Read `DESIGN.md` for values; never restate or override it.
- For a new component, also load `nachui-component-authoring`. For accessibility details, load `accessibility`; for composition, `composition-patterns`; for React performance, `react-best-practices`.
- Work inline in the main thread. No subagents.
- Ask every open question in one batch at the start, each with a recommendation. Then finish end to end.
- Git: one-line conventional commits in English that pass `commitlint.config.ts`, no `Co-Authored-By` or AI trailer. Never push, open a PR or `git stash` unless asked in that turn.
- Reply in the user's language (Rioplatense Spanish), short.

## Decision Gates

| Situation | Action |
| --- | --- |
| New component, page or the direction is open | Design canvas with 2 or 3 directions, desk and phone; wait for the pick |
| Direction picked or the fix is small | Build directly |
| Asked to audit or find inconsistencies | Switch to `nachui-design-audit` |
| Change touches tokens or themes | Switch to `nachui-design-tokens` |
| `DESIGN.md` and a request disagree | Say so, propose the `DESIGN.md` change, wait |

## Execution Steps

1. Read the code and the closest existing component or page that already solves the same thing.
2. Ask the open questions in one batch.
3. Draw the canvas when a gate says so (`references/workflow.md`), wait for the pick.
4. Build per `references/design-rules.md` and `references/frontend-craft.md`: every state, phone, en and es together.
5. Look at it on the docs dev server at 1440, 768 and 390, in en and es, light and dark (`references/workflow.md`). Fix and look again.
6. Run the review in `references/ux-principles.md` and the taste skill's `critique.md` on the screenshots. Fix what fails.
7. Report and stop. Commit only when the user says so.

## Output Contract

End every finished turn with what changed, the assumptions taken, and a numbered list of what to test: URL, clicks, expected result, plus phone, keyboard, dark and Spanish checks. Return canvases as their link. Never claim a check that was not run.

## References

- `references/design-rules.md`: catalog and copy rules on top of `DESIGN.md`.
- `references/ux-principles.md`: the bar every component and page is checked against.
- `references/frontend-craft.md`: portability, Next 16 in `apps/web`, MDX, i18n, RTL, performance.
- `references/workflow.md`: canvases, dev server, screenshots, checks, commits.
- `DESIGN.md`, `AGENTS.md`, `CONTRIBUTING.md`.
