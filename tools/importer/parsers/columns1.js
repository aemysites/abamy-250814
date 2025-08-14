/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Columns (columns1)'];
  // Get all direct columns (left and right)
  const columns = Array.from(element.querySelectorAll(':scope > .column'));

  // Defensive: If there are not at least two columns, fallback to entire element
  let col1Content = '';
  let col2Content = '';
  if (columns.length >= 2) {
    // COLUMN 1: Take the entire child div (with border-round and picture)
    const col1 = columns[0];
    // Look for .border-round or .sc-ResponsiveImg (could be either)
    let imgContainer = col1.querySelector('.border-round, .sc-ResponsiveImg');
    if (!imgContainer) {
      // Fallback to first <img> or <picture>
      imgContainer = col1.querySelector('picture,img');
    }
    col1Content = imgContainer || col1; // prefer the image block, fallback whole column

    // COLUMN 2: Traverse nested .columns > .column > * > .sc-RichText
    const col2 = columns[1];
    let richText = col2.querySelector('.sc-RichText');
    if (!richText) {
      // Fallback to first inner column
      const innerCol = col2.querySelector('.column');
      if (innerCol) {
        richText = innerCol;
      } else {
        richText = col2;
      }
    }
    col2Content = richText;
  } else {
    // Fallback: use the whole element
    col1Content = element;
    col2Content = '';
  }

  // Build the row for the table
  const contentRow = [col1Content, col2Content];

  // Only one table (no Section Metadata in example)
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}