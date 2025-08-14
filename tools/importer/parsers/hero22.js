/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: strictly matching example
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row
  // Find a div with inline style containing background image url
  let bgImageUrl = '';
  let bgImageFound = false;
  let bgDivs = element.querySelectorAll('div[style]');
  for (const div of bgDivs) {
    const style = div.getAttribute('style');
    if (style && style.includes('url(')) {
      const match = style.match(/url\(("|')?(.*?)\1?\)/);
      if (match && match[2]) {
        bgImageUrl = match[2];
        bgImageFound = true;
        break;
      }
    }
  }

  let bgCellContent = '';
  if (bgImageFound && bgImageUrl) {
    // Create an <img> element, as in the structure example
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    bgCellContent = img;
  }
  // Row for background image (optional)
  const bgRow = [bgCellContent];

  // 3. Content row: headline, subheading, CTA
  // Find the main content column (the central one with text and CTA)
  let contentColumn = null;
  const centralColumns = element.querySelectorAll('.column');
  for (const col of centralColumns) {
    if (
      col.classList.contains('is-md-6') ||
      col.classList.contains('is-lg-6')
    ) {
      contentColumn = col;
      break;
    }
  }
  const contentParts = [];
  if (contentColumn) {
    // Find the innermost text div
    let targetDiv = contentColumn;
    // Traverse possibly nested structure to get to actual text block
    while (
      targetDiv.children.length === 1 &&
      targetDiv.firstElementChild &&
      targetDiv.firstElementChild.tagName.toLowerCase() === 'div'
    ) {
      targetDiv = targetDiv.firstElementChild;
    }
    // Collect all direct <p> children (preserving formatting and links)
    const pEls = targetDiv.querySelectorAll('p');
    for (const p of pEls) {
      contentParts.push(p);
    }
  }
  const contentRow = [contentParts.length > 0 ? contentParts : ''];

  // Structure: 1 column, 3 rows
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
