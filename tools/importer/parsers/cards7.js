/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards7) block table header
  const headerRow = ['Cards (cards7)'];
  const cardRows = [];
  // Select only direct child columns
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach(col => {
    // Find the banner block within the column
    const banner = col.querySelector('.sc-Banner');
    if (!banner) return;

    // Extract image from <picture><img>
    let imgEl = null;
    const picture = banner.querySelector('.sc-Banner-picture picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) imgEl = img;
    }
    // Compose text cell: title, description (if any), CTA
    const textCellContent = [];
    const contentDiv = banner.querySelector('.sc-Banner-content');
    if (contentDiv) {
      // Title (may contain <strong> or <span>)
      const title = contentDiv.querySelector('.sc-Banner-title');
      if (title) {
        textCellContent.push(title);
      }
      // Description (not present in provided HTML, so skip)
      // CTA: Button--arrow (linked text)
      const cta = contentDiv.querySelector('.Button--arrow');
      if (cta) {
        textCellContent.push(cta);
      }
    }
    // Add this card row to table
    cardRows.push([imgEl, textCellContent]);
  });
  // Build cells array for createTable
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
