/* global WebImporter */
export default function parse(element, { document }) {
  // The required header row
  const headerRow = ['Columns (columns16)'];

  // The input has a .flex element with two columns: .left and .right
  // Get both columns (should be two children)
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return; // Defensive: expect exactly 2 columns

  // The left and right DOM elements
  const leftCol = columns[0];
  const rightCol = columns[1];

  // For each column, reference the column itself as the cell content
  // (do not clone or create new elements, per requirements)
  const row = [leftCol, rightCol];

  // Compose the table data
  const cells = [headerRow, row];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
