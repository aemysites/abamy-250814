/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns15)'];
  
  // Get direct child columns (left, right)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: if not exactly two columns, fill with empty divs
  let leftColContent = columns[0] || document.createElement('div');
  let rightColContent = columns[1] || document.createElement('div');

  // Table row: each cell is the DOM element from the column
  const row = [leftColContent, rightColContent];

  // Build the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
