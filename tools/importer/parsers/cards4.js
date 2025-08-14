/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as required
  const headerRow = ['Cards (cards4)'];

  // Find the columns container
  const columnsDiv = element.querySelector('.columns');
  if (!columnsDiv) return;

  // Get all direct child columns (first is intro, skip it)
  const columns = Array.from(columnsDiv.children);
  const cardColumns = columns.slice(1);

  // Each card row: [image, all visible text content]
  const cardRows = cardColumns.map(col => {
    // Find card figure
    const figure = col.querySelector('figure.sc-Card');
    if (!figure) return null;
    // Find image
    const img = figure.querySelector('img');
    // Find figcaption (which contains the card text block)
    const figcaption = figure.querySelector('figcaption');
    let textCell;
    if (figcaption) {
      // Reference the figcaption (not clone!) to keep formatting
      textCell = figcaption;
    } else {
      // Fallback: create a div with alt text, only if figcaption missing
      textCell = document.createElement('div');
      textCell.textContent = img && img.alt ? img.alt : '';
    }
    return [img, textCell];
  }).filter(row => row[0] && row[1]); // Filter out any incomplete rows

  // Assemble table rows: header, followed by card rows
  const tableRows = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
