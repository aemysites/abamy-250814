/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards22)'];
  const rows = [];

  // Get immediate child "columns"
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Each card is inside .sc-Banner
    const banner = col.querySelector('.sc-Banner');
    if (!banner) return;

    // 1. Extract image (first cell)
    let imgCell = '';
    const picWrap = banner.querySelector('.sc-Banner-picture picture');
    if (picWrap) {
      const img = picWrap.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // 2. Extract text and CTA (second cell)
    const textParts = [];
    // Grab the .sc-Banner-title (keep original element for formatting)
    const title = banner.querySelector('.sc-Banner-title');
    if (title) textParts.push(title);

    // CTA: .Button--arrow (the visible CTA)
    // There may be two a's, but only .Button--arrow contains visible CTA text
    const cta = banner.querySelector('.Button--arrow');
    if (cta) textParts.push(cta);

    rows.push([imgCell, textParts]);
  });

  // Build the table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
