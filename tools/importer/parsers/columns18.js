/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header matches exactly
  const headerRow = ['Columns (columns18)'];

  // 2. Get top-level flex columns
  const mainContainer = element.querySelector('.mainContainer');
  const flex = mainContainer ? mainContainer.querySelector('.flex') : null;

  // Defensive: fallback to element itself if structure changes
  const columns = flex ? [
    flex.querySelector('.leftContainer'),
    flex.querySelector('.rightContainer')
  ] : [];

  // Prepare left column content
  let leftCellContent = [];
  if (columns[0]) {
    // Find first bubbles image
    const bubblesImg = columns[0].querySelector('.bubblesContainer > img');
    if (bubblesImg) leftCellContent.push(bubblesImg);

    // Find bubble text container (all question divs)
    const bubblesDiv = columns[0].querySelector('.bubbles');
    if (bubblesDiv) leftCellContent.push(bubblesDiv);

    // Find mobile image
    const mobileImg = columns[0].querySelector('img.mobile-show');
    if (mobileImg) leftCellContent.push(mobileImg);

    // Find heading, if present
    const h3 = columns[0].querySelector('h3');
    if (h3) leftCellContent.push(h3);

    // Find paragraph, if present
    const p = columns[0].querySelector('p');
    if (p) leftCellContent.push(p);

    // Defensive: if nothing found, add empty string
    if (leftCellContent.length === 0) leftCellContent = [''];
  } else {
    leftCellContent = [''];
  }

  // Prepare right column content (main image only)
  let rightCellContent = [];
  if (columns[1]) {
    // Only add image if present
    const rightImg = columns[1].querySelector('img');
    if (rightImg) rightCellContent.push(rightImg);
    if (rightCellContent.length === 0) rightCellContent = [''];
  } else {
    rightCellContent = [''];
  }

  // Table: header, then one row with two columns
  const tableCells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
