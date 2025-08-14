/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row as in the example
  const headerRow = ['Columns (columns25)'];

  // 2. Find all direct column elements inside .columns
  // Also handles missing/empty cases
  const columnsWrapper = element.querySelector('.columns');
  let columns = [];
  if (columnsWrapper) {
    columns = columnsWrapper.querySelectorAll(':scope > .column');
  }

  // 3. For each column, get image/picture and relevant rich text
  const columnCells = Array.from(columns).map((col) => {
    // Get first picture in this column
    let picEl = col.querySelector('picture');
    // Get the rich text block (sc-RichText)
    let richTextEl = col.querySelector('.sc-RichText');

    // Compose a cell with both image and text, maintaining order
    // Omit empty elements
    const cellContent = [];
    if (picEl) cellContent.push(picEl);
    if (richTextEl) cellContent.push(richTextEl);
    // If both are missing, cell will be empty string
    return cellContent.length ? cellContent : '';
  });

  // 4. Build the table rows: header, then columns row
  const rows = [headerRow, columnCells];

  // 5. Create the block table using WebImporter
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the new block table
  element.replaceWith(block);
}
