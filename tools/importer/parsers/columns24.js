/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, as per requirements
  const headerRow = ['Columns (columns24)'];

  // Find the left and right column containers
  const leftContainer = element.querySelector('.leftContainer');
  const rightContainer = element.querySelector('.rightContainer');

  // Compose left column cell - include all direct children of leftContainer
  let leftContent = [];
  if (leftContainer) {
    Array.from(leftContainer.children).forEach(child => {
      leftContent.push(child);
    });
  }

  // Compose right column cell - include all direct children of rightContainer
  let rightContent = [];
  if (rightContainer) {
    Array.from(rightContainer.children).forEach(child => {
      rightContent.push(child);
    });
  }

  // The second row should have as many columns as there are columns in the layout
  const secondRow = [leftContent, rightContent];

  // Build the table data
  const cells = [headerRow, secondRow];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
