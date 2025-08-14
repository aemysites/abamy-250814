/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Columns (columns2)'];

  // Get the top-level columns (should be exactly 2)
  const columns = Array.from(element.querySelectorAll(':scope > .column'));
  if (columns.length !== 2) return;

  // ------ LEFT COLUMN ------
  // Find the image container or image
  let leftCell = null;
  // Prefer border-round.sc-ResponsiveImg (contains <picture> and <img>)
  leftCell = columns[0].querySelector('.border-round.sc-ResponsiveImg');
  if (!leftCell) {
    // fallback: picture or img directly
    leftCell = columns[0].querySelector('picture') || columns[0].querySelector('img');
  }
  if (!leftCell) {
    // fallback: include the whole column if nothing else
    leftCell = columns[0];
  }

  // ------ RIGHT COLUMN ------
  // Find the deepest .sc-RichText, but in a robust way
  // There may be other wrappers, so we want just the text content block
  let rightCell = null;
  // Try to find the actual rich text block (.sc-RichText)
  const richText = columns[1].querySelector('.sc-RichText');
  if (richText) {
    // If found, take all its child nodes (preserving paragraphs, links, formatting)
    rightCell = Array.from(richText.childNodes);
  } else {
    // fallback: use all child nodes of the right column
    rightCell = Array.from(columns[1].childNodes);
  }

  // Assemble the table
  const tableData = [headerRow, [leftCell, rightCell]];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(table);
}
