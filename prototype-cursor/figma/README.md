# Figma Plugin API scripts

Target file: https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg

These scripts were executed via Figma MCP `use_figma` (not as a Desktop plugin). They seed Auto Layout screens that match the HTML prototype.

| Script | Result |
| --- | --- |
| `config.js` | fileKey / URL |
| `01-ontology-home.js` | Page Ontology Workbench, 1440×900 home |
| `02-oag-compare.js` | Page OAG vs RAG, compare columns |

Live HTML captures (html-to-design) sit on the same file:

- Capture / Ontology Home → node `3:2`
- Capture / OAG Compare → node `4:2`

Constraints used: appendChild before `layoutSizing = FILL`; Inter style `"Semi Bold"`; colors 0–1; no `figma.notify()`.
