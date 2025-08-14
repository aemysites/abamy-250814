/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Compose header row
  const headerRow = ['Hero (hero17)'];

  // 2. Extract the image (prefer mobile for full aspect ratio, fallback to desktop)
  let imageEl = null;
  const heroSection = element.querySelector('.columns.columns--center.no-margin');
  if (heroSection) {
    imageEl = heroSection.querySelector('.mobile-show img');
    if (!imageEl) {
      // fallback: desktop image
      imageEl = heroSection.querySelector('.column img');
      if (!imageEl) {
        // fallback: any img inside heroSection
        imageEl = heroSection.querySelector('img');
      }
    }
  }

  // 3. Extract the text and CTA: left column (centered text)
  let textCol = null;
  let textContent = null;
  if (heroSection) {
    // Find the column with text content
    const columns = heroSection.querySelectorAll('.column');
    for (const col of columns) {
      // Look for a column containing a styled paragraph and a link
      if (col.querySelector('p') && col.querySelector('a')) {
        textCol = col;
        break;
      }
    }
    if (textCol) {
      // Find the innermost content div with padding
      const paddedDiv = textCol.querySelector('div[style*="padding"]');
      textContent = paddedDiv || textCol;
    }
  }

  // Defensive: If no heroSection, fallback to top-level element
  if (!imageEl) {
    imageEl = element.querySelector('img');
  }
  if (!textContent) {
    textContent = element;
  }

  // 4. Compose block table (1 column, 3 rows)
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textContent ? textContent : '']
  ];

  // 5. Replace original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
