/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches example
  const headerRow = ['Hero (hero11)'];

  // Find picture/image element for background
  let imgEl = null;
  const pictureContainer = element.querySelector('.sc-Banner-picture picture');
  if (pictureContainer) {
    imgEl = pictureContainer.querySelector('img');
  }

  // Extract the main content block containing the heading, etc.
  // There may be nested sections, so get first .sc-Banner-content under .columns
  let contentBlock = null;
  const columnsContainer = element.querySelector('.columns');
  if (columnsContainer) {
    contentBlock = columnsContainer.querySelector('.sc-Banner-content');
  }

  // Fallback if direct child not found
  if (!contentBlock) {
    contentBlock = element.querySelector('.sc-Banner-content');
  }

  // Ensure empty row if image missing
  const imageRow = imgEl ? [imgEl] : [''];
  // Ensure empty row if content missing
  const contentRow = contentBlock ? [contentBlock] : [''];

  // Compose table array: header, image, content
  const cells = [headerRow, imageRow, contentRow];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
