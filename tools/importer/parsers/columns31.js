/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches the requirement
  const headerRow = ['Columns (columns31)'];

  // 2. Get immediate child columns (not nested)
  const columnElements = Array.from(element.querySelectorAll(':scope > div'));

  // 3. For each column, extract its meaningful content
  const rowCells = columnElements.map((col) => {
    // If the column contains another .columns block, flatten its content
    const nestedColumns = col.querySelectorAll(':scope > .columns > .column');
    let cellContent = [];

    if (nestedColumns.length > 0) {
      nestedColumns.forEach((nestedCol) => {
        // Get all element nodes from nestedCol
        Array.from(nestedCol.childNodes).forEach((node) => {
          if (node.nodeType === 1) {
            cellContent.push(node);
          }
        });
      });
    } else {
      // Get all direct element children
      Array.from(col.childNodes).forEach((node) => {
        if (node.nodeType === 1) {
          cellContent.push(node);
        }
      });
    }

    // If only one element, use it directly; if multiple, use array; if none, use empty string
    if (cellContent.length === 1) {
      return cellContent[0];
    } else if (cellContent.length > 1) {
      return cellContent;
    } else {
      return '';
    }
  });

  // 4. Compose table data
  const cells = [headerRow, rowCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element
  element.replaceWith(table);
}
