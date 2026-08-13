/**
 * Seeds page "OAG vs RAG" in file lE6MjA5vzEkxHljOTRDTNg
 * Screen: OAG / Compare — RAG vs OAG (1440×900)
 */
async function seedOagCompare(figma) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  const page = figma.createPage();
  page.name = "OAG vs RAG";
  await figma.setCurrentPageAsync(page);
  return { pageId: page.id };
}
