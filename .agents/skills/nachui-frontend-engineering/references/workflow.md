# Workflow

## 1. Read and ask

- Read the files you will touch and the closest neighbour that already solves the same thing (for a popup, `select.tsx`; for a composite widget, `toggle-group.tsx`; for a page, the nearest docs page).
- One batch of questions, each with a recommendation. Then work end to end.

## 2. Canvases

- Use the Artifact tool with `action: "quickstart"` and `intent: "design"`, then follow its instructions. Boards at 1440 (desk) and 390 (phone).
- 2 or 3 directions named A, B, C, each a real alternative, all drawn with NachUI's real tokens, fonts (Geist, Schibsted Grotesk, Geist Mono) and radius scale. Wait for the pick; never build two.
- Never verify a canvas by rendering it; check its source.

## 3. Build

- While working, check only what you touched:
  - `pnpm --filter @repo/ui exec vitest run --project unit <files>`
  - `pnpm --filter @repo/ui exec vitest run --project browser <files>`
  - `pnpm exec eslint --max-warnings 0 <files>`
  - `pnpm exec prettier --write <files>`
- Never run `pnpm format` on the whole repo. Never `git stash` while a dev server or another agent is working on the tree.

## 4. Look at it

- Run `pnpm --filter web dev` (http://localhost:3000). Pages live under `/en/...` and `/es/...`; a component's page is `/<locale>/docs/elements/<family>/<name>`.
- Screenshot with Playwright from `packages/ui`, where it is installed: `createRequire(process.cwd() + '/package.json')('playwright')`. Save scripts and images in the session scratchpad, never in the repo.
- Capture at 1440, 768 and 390; en and es; light and dark. For dark, set `localStorage['theme-preference'] = 'dark'` with `page.addInitScript` before navigating.
- Check: every state of the demo, keyboard-only pass, focus on open and close, long content, RTL for horizontal widgets.

## 5. Report

Short, in the user's language: what changed, assumptions, then a numbered test list:

1. Where to go (URL).
2. What to click or type.
3. What should happen.
4. Phone, keyboard, dark, Spanish and RTL checks.

Then stop. Nothing is committed until the user says so.

## 6. Close

- Run the repo checks once, at the end: `pnpm checks`, `pnpm check-types`, `pnpm lint`, `pnpm test`, plus `pnpm --filter @repo/ui test:browser` when interactive behaviour changed and `pnpm turbo run build --filter=web` when docs or routes changed.
- Commits: one line, `type(scope): summary`, English, types from `commitlint.config.ts`, split by logical unit (lib, component, docs, web). No body, no `Co-Authored-By`, no AI trailer.
- Push and PRs only when asked in that turn. Never commit `.taste-skill/`.
