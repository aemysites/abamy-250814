/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns wrapper
  const columns = element.querySelector('.columns');
  if (!columns) return;

  // Grab the card columns (skip the first column, which is intro)
  const allColumns = columns.querySelectorAll(':scope > .column');
  const cardColumns = Array.from(allColumns).slice(1);

  // Build card rows
  const cardRows = cardColumns.map((col) => {
    // Find the figure containing image and caption
    const figure = col.querySelector('figure.sc-Card');
    if (!figure) return null;

    // Get image (mandatory)
    let img = null;
    const imgDiv = figure.querySelector('.sc-Card-img');
    if (imgDiv) img = imgDiv.querySelector('img');
    if (!img) return null;

    // Get the figcaption (may include title and description)
    let textBlock = null;
    const figcaption = figure.querySelector('figcaption');
    if (figcaption) {
      // If only one child, just reference that
      const children = Array.from(figcaption.children);
      if (children.length === 1) {
        textBlock = children[0];
      } else {
        // Otherwise, use all children
        textBlock = [];
        children.forEach(child => textBlock.push(child));
      }
    }
    if (!textBlock) return null;
    return [img, textBlock];
  }).filter(Boolean);

  // Compose the block table
  const rows = [
    ['Cards (cards2)'],
    ...cardRows
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
