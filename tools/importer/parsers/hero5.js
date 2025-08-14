/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Hero (hero5)'];

  // --- Background image row ---
  let bgImg = '';
  // Find the .sc-Banner-picture at any depth (could be a child or sibling)
  const pictureContainer = element.querySelector('.sc-Banner-picture');
  if (pictureContainer) {
    const img = pictureContainer.querySelector('img');
    if (img) bgImg = img;
  }

  // --- Content row ---
  let contentCell = '';
  // Find .sc-Banner-content at any depth
  const content = element.querySelector('.sc-Banner-content');
  if (content) {
    // If empty (all children are empty), leave as ''
    const textContent = content.textContent.trim();
    if (textContent.length > 0 || content.querySelector('h1,h2,h3,h4,h5,h6,p,a,span')) {
      contentCell = content;
    }
  }

  // Build the table as: [header], [background image], [content]
  const rows = [
    headerRow,
    [bgImg],
    [contentCell],
  ];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
