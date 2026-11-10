# Documenting the audit

## The artifact

- Artifact tool, `action: "quickstart"`, `intent: "design"`; create the canvas from the type it names and follow its instructions. Title: «Auditoría de diseño de <scope>».
- Upload each crop as an asset (`publish` with `asset: true`) and reference it by the returned url.
- **One board per finding**, 1280 wide, drawn with NachUI's real tokens and fonts:
  - tags: priority (Alta / Media / Baja) · area (from the checklist) · device (Escritorio / Teléfono / ambos) · theme when it matters;
  - heading `NN · <the problem in a few words>`;
  - one or two sentences: what is wrong, which `DESIGN.md` section or neighbour it breaks, why it matters;
  - two columns: «Antes» (the real crop) and «Después» (the proposal drawn in HTML with the real look), plus a one-line note on the change and the file it touches.
- Group boards under section titles by zone (Overlays, Forms, Navigation, Feedback, Docs pages, Landing), ordered by priority inside each group.
- A summary note beside the first group: date, widths, locales and themes captured, count by priority.
- Never verify the canvas by rendering it; check its source.

## Hand-off

Reply with the link and the numbered findings by priority, then stop. Apply only what the user picks, in order, each followed by a look on the dev server. Report with a numbered test list per finding.
