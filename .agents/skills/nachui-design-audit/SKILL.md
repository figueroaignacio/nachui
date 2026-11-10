---
name: nachui-design-audit
description: "Trigger: audit, inconsistencies, review the catalog or the site against DESIGN.md, before and after. Finds NachUI drift with real captures, ranks it and documents it as a Design artifact."
license: Apache-2.0
metadata:
  author: figueroaignacio
  version: "1.0"
---

## Activation Contract

Load when asked to audit the catalog (`packages/ui`), the docs site (`apps/web`) or one area of either for inconsistencies: tokens, radius, spacing, focus, variants, dark mode, RTL, en/es parity, or API drift between similar components. Not for building a new component (`nachui-component-authoring`).

## Hard Rules

- `DESIGN.md` is the standard. A finding cites the section it breaks, or the closest component that already sets the pattern.
- Every finding needs a real capture from the running site or a browser test. No finding from code reading alone; code is where you locate the cause.
- Audit only. Apply nothing until the user picks.
- With `/design`, or when asked to document, the result is a Design artifact (`references/artifact.md`).
- Load `.agents/skills/accessibility` for the accessibility pass and `.agents/skills/design-taste-frontend` (`critique.md`) for the visual pass. On any conflict, `DESIGN.md` wins.
- Work inline. No subagents.
- Reply in the user's language (Rioplatense Spanish), short.

## Decision Gates

| Situation | Action |
| --- | --- |
| Scope not given | Ask once: catalog, site, or one area; recommend the area with the most recent changes |
| The fix is a token value | Hand it to `nachui-design-tokens` when applying |
| `DESIGN.md` itself is wrong or silent | Report it as a finding about `DESIGN.md`, proposing the text |
| Two components disagree and both are valid | Pick the one closer to `DESIGN.md` as the standard; say which |

## Execution Steps

1. Agree the scope.
2. Capture the real thing per `references/capture.md`.
3. Walk the checklist in `references/checklist.md` on the captures, then locate each cause in code.
4. Rank: Alta (breaks meaning, access or the main flow), Media (inconsistent or confusing), Baja (polish). Number `01…NN` by impact.
5. Document per `references/artifact.md`.
6. Reply with the link and the findings as a numbered list by priority. Wait for the pick («aplicá todo», «solo las altas», by number).
7. Apply the picked ones following `nachui-frontend-engineering`, look again, report with a test list.

## Output Contract

The audit turn ends with the artifact link, the count by priority, and the numbered findings (number, priority, area, one line each). The apply turn ends with what changed per finding and a numbered test list. The canvas is the record; don't edit it after the fact unless asked.

## References

- `references/checklist.md`: what to look for, mapped to `DESIGN.md`.
- `references/capture.md`: how to capture components and pages.
- `references/artifact.md`: board format and hand-off.
