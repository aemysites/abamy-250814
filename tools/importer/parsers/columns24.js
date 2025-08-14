/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as specified in the requirements
  const headerRow = ['Columns (columns24)'];

  // Get the direct children columns
  const directColumns = Array.from(element.querySelectorAll(':scope > div'));
  
  // Map each direct column to its content for the table row
  const secondRow = directColumns.map((col) => {
    // Bulma columns may be nested, so descend until hitting a non-columns direct child
    let content = col;
    // Unwrap 1-deep nested .columns/.column wrappers (as often happens in Bulma)
    while (
      content.children.length === 1 &&
      (content.firstElementChild.classList.contains('columns') || content.firstElementChild.classList.contains('column'))
    ) {
      content = content.firstElementChild;
    }
    // Reference the ACTUAL content element (not a wrapper)
    return content;
  });

  // Compose and create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace the original element in-place with the new table block
  element.replaceWith(table);
}
