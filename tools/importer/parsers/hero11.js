/* global WebImporter */
export default function parse(element, { document }) {
  // Header exactly as in the example
  const headerRow = ['Hero (hero11)'];

  // Row 2: Background image (none in source, so empty string)
  const backgroundRow = [''];

  // Row 3: Title/subheading/copy etc.
  // Move all children into a wrapper div to preserve formatting and structure, referencing existing nodes
  const contentDiv = document.createElement('div');
  while (element.firstChild) {
    contentDiv.appendChild(element.firstChild);
  }
  const contentRow = [contentDiv];

  // Compose the cells/rows
  const cells = [headerRow, backgroundRow, contentRow];

  // Create the table using the provided API
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
