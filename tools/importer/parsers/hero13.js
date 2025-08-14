/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Header row
  const headerRow = ['Hero (hero13)'];

  // Step 2: Find main content area (the inner colored box)
  // Use the first .sc-RichText if it exists
  const richText = element.querySelector('.sc-RichText');
  let mainColumns = richText ? richText.querySelector('.columns.no-margin') : null;

  // Step 3: Find the image (prefer desktop version, else mobile)
  let img = null;
  if (mainColumns) {
    // Desktop image
    img = mainColumns.querySelector('.column.mobile-hide img');
    if (!img) {
      // Mobile image
      img = mainColumns.querySelector('.column.mobile-show img');
    }
  }

  // Step 4: Compose image cell
  const imageCell = img ? [img] : [''];

  // Step 5: Get text and CTA content from left column
  let textCol = null;
  if (mainColumns) {
    // The left column: not hidden nor mobile-only
    // This will match the first column with text (ignore spacers and images)
    textCol = Array.from(mainColumns.children).find(col => {
      const style = col.getAttribute('style') || '';
      return style.includes('text-align') && !col.classList.contains('mobile-hide') && !col.classList.contains('mobile-show');
    });
  }

  let contentCell = [];
  if (textCol) {
    // Find the div with padding (main content container)
    const textContainer = textCol.querySelector('div[style*="padding"]');
    if (textContainer) {
      // Grab all paragraphs and the CTA
      // Headline (first <p>)
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent && p.textContent.trim() !== '' && p.innerHTML.trim() !== '&nbsp;') {
          contentCell.push(p);
        }
      });
      // CTA: Any <a> inside a .Button or ButtonQuizz--tertiary
      const cta = textContainer.querySelector('a.Button, a.ButtonQuizz--tertiary');
      if (cta) {
        contentCell.push(cta);
      }
    }
  }

  // Step 6: Compose table
  const cells = [
    headerRow,
    imageCell,
    [contentCell]
  ];

  // Step 7: Create the table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
