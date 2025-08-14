/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero13)'];

  // Background image row: none found in provided HTML
  // Per instructions, keep cell present, but empty
  const bgImageRow = [''];

  // Title/content row: goal is to preserve all headline styling and content
  // The headline is inside .sc-Title-title (which contains both mobile and desktop variants)
  // We want the full h2, which contains both desktop and mobile title variants as children
  let titleRow = [''];
  const h2 = element.querySelector('h2');
  if (h2) {
    titleRow = [h2];
  } else {
    // If not found, fallback to main title block
    const titleBlock = element.querySelector('.sc-Title-title');
    if (titleBlock) {
      titleRow = [titleBlock];
    } else {
      // As a last fallback, use the content area
      titleRow = [element];
    }
  }

  // Compose the table matching the example: 1 column, 3 rows
  const cells = [
    headerRow,
    bgImageRow,
    titleRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}