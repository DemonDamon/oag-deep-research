/**
 * Incremental Plugin API used to seed
 * https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg
 *
 * Run via Figma MCP use_figma (not as a standalone plugin).
 * Rule: appendChild BEFORE layoutSizing FILL; Inter style is "Semi Bold".
 */
async function seedOntologyHome(figma) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

  const page = figma.currentPage;
  page.name = "Ontology Workbench";

  const screen = figma.createAutoLayout("VERTICAL", {
    name: "Ontology / Home — Decision Loop",
  });
  screen.resize(1440, 900);
  screen.primaryAxisSizingMode = "FIXED";
  screen.counterAxisSizingMode = "FIXED";
  screen.itemSpacing = 0;
  screen.fills = [{ type: "SOLID", color: { r: 0.933, g: 0.941, b: 0.957 } }];
  screen.x = 80;
  screen.y = 80;

  return { screenId: screen.id, pageId: page.id };
}
