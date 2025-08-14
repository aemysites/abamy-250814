/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match sample: 'Hero (hero9)'
  const headerRow = ['Hero (hero9)'];

  // No background image in HTML, so row 2 is empty string
  const backgroundRow = [''];

  // Find the main content area
  const richText = element.querySelector('.sc-RichText') || element;

  // Try to get the most prominent headline (desktop headline if present, else mobile)
  const mobileHide = richText.querySelector('.mobile-hide');
  const mobileShow = richText.querySelector('.mobile-show');

  // Use desktop headline if available, else use mobile
  let headlineElem = null;
  if (mobileHide) {
    headlineElem = mobileHide;
  } else if (mobileShow) {
    headlineElem = mobileShow;
  }

  // Get supporting paragraph if present
  const paragraph = richText.querySelector('p');

  // Collect everything for the content row
  // Reference original elements directly (not cloning)
  const contentElems = [];
  if (headlineElem) contentElems.push(headlineElem);
  if (paragraph) contentElems.push(paragraph);

  // If nothing was found, fill with empty string for resilience
  const contentRow = [contentElems.length ? contentElems : ['']];

  // Compose block table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
