/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: must be exactly 'Hero (hero9)'
  const headerRow = ['Hero (hero9)'];

  // 2. Image/background row: the example has an image, but
  // the provided HTML does NOT have an image (or background asset element),
  // so this row is just an empty cell.
  const imageRow = [''];

  // 3. Content row: extract the headline and reference the existing heading structure
  // The main headline is inside h2.sc-Title-title, but this may include desktop/mobile versions
  // We'll reference the h2 directly, which includes all headline variants
  let headlineElem = element.querySelector('h2');
  if (!headlineElem) {
    // fallback: there may be no h2, just use the full block
    headlineElem = element;
  }

  const contentRow = [headlineElem];

  // Compose the table as per requirements
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
