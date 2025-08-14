/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header Row: Must exactly match example
  const headerRow = ['Hero (hero20)'];

  // 2. Background Image Row: extract from section style
  let bgImgRow = [''];
  if (element.style && element.style.backgroundImage) {
    const match = element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      const bgImgEl = document.createElement('img');
      bgImgEl.src = match[1];
      bgImgEl.alt = '';
      bgImgRow = [bgImgEl];
    }
  }

  // 3. Content Row: Gather all text content and CTA from the white box
  // Find all visually-present .column elements INSIDE .sc-RichText
  let contentCell = '';
  const richText = element.querySelector('.sc-RichText');
  if (richText) {
    // Find all relevant columns with background white
    const columns = Array.from(richText.querySelectorAll('.column'));
    // Filter columns that are visually rendered (white bg)
    const mainColumns = columns.filter(col => {
      // Check for white bg or style property
      const bgColor = col.style.backgroundColor || '';
      return bgColor.toLowerCase() === 'white' || bgColor === 'rgb(255, 255, 255)';
    });
    // If found, combine all white box columns in one content cell
    if (mainColumns.length > 0) {
      // If more than one, group into a div
      if (mainColumns.length === 1) {
        contentCell = mainColumns[0];
      } else {
        const groupDiv = document.createElement('div');
        mainColumns.forEach(col => groupDiv.appendChild(col));
        contentCell = groupDiv;
      }
    } else if (columns.length > 0) {
      // If no white box, fallback to first column
      contentCell = columns[0];
    } else {
      // As last resort, use all content from richText
      contentCell = richText;
    }
  }

  // 4. Compose and replace
  const cells = [headerRow, bgImgRow, [contentCell]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
