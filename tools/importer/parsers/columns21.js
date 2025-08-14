/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row: 1 cell, exactly as in the example
  const headerRow = ['Columns (columns21)'];

  const richText = element.querySelector('.sc-RichText');
  if (!richText) return;

  // Find the heading (desktop preferred, fallback to mobile)
  let headingDiv = richText.querySelector('.mobile-hide > div');
  if (!headingDiv) {
    headingDiv = richText.querySelector('.mobile-show > div');
  }

  // Find the columns (desktop version for highest fidelity)
  let columnsWrapper = richText.querySelector('.columns.mobile-hide .columns');
  if (!columnsWrapper) {
    columnsWrapper = richText.querySelector('.columns .columns');
  }
  if (!columnsWrapper) {
    // Only heading if no columns found
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      [headingDiv || '']
    ], document);
    element.replaceWith(block);
    return;
  }

  // Extract each column's content (img + text)
  const columnDivs = Array.from(columnsWrapper.children);
  const columnsContent = columnDivs.map((col) => {
    // Keep all direct children (img and div) in order
    return Array.from(col.childNodes).filter(node => {
      // Keep elements and non-empty text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '');
    });
  });

  // Compose main row: heading cell first, then each column cell
  const contentRow = [headingDiv || '', ...columnsContent];

  // Final table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
