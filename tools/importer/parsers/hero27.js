/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Hero (hero27)'];

  // No background image in this HTML block
  const imgRow = [''];

  // Find the content block for the hero text
  // Look for .sc-RichText then its children, else fallback
  let richTextContainer = element.querySelector('.sc-RichText');
  let contentElements = [];

  if (richTextContainer) {
    // Collect all direct children of .sc-RichText (mobile-hide, mobile-show, etc.)
    contentElements = Array.from(richTextContainer.children);
    // If none, use container itself
    if (contentElements.length === 0) contentElements = [richTextContainer];
  } else {
    // If .sc-RichText missing, fallback to direct children of element
    contentElements = Array.from(element.children);
    if (contentElements.length === 0) contentElements = [element];
  }

  // Ensure all content is included, and reference actual document elements
  // If only one element, use it directly, else array
  const textRow = [contentElements.length === 1 ? contentElements[0] : contentElements];

  // Construct table: 1 column, 3 rows
  const cells = [headerRow, imgRow, textRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
