/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get direct child by class from a root
  function getDirectChildByClass(root, className) {
    return Array.from(root.children).find(child => child.classList && child.classList.contains(className));
  }

  // Header row
  const headerRow = ['Hero (hero14)'];

  // Background image row
  let imageEl = null;
  // The background is present as a style on a div
  const storeLocator = element.querySelector('.sc-StoreLocator');
  let placeholderDiv = null;
  if (storeLocator) {
    const mapDiv = getDirectChildByClass(storeLocator, 'sc-StoreLocator-map');
    if (mapDiv) {
      placeholderDiv = mapDiv.querySelector('.sc-StoreLocator-noCookiePlaceholder');
      if (placeholderDiv && placeholderDiv.style && placeholderDiv.style.backgroundImage) {
        const bg = placeholderDiv.style.backgroundImage;
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          imageEl = document.createElement('img');
          imageEl.src = match[1];
          imageEl.setAttribute('loading', 'lazy');
        }
      }
    }
  }
  const bgRow = [imageEl ? imageEl : ''];

  // Content row: title, subheading, call-to-action, etc.
  const contentParts = [];
  if (placeholderDiv) {
    // Title: h3
    const h3 = placeholderDiv.querySelector('h3');
    if (h3) contentParts.push(h3);
    // Call-to-action: button (if present)
    const button = placeholderDiv.querySelector('button');
    if (button) contentParts.push(button);
  }
  // Also append the 'google warning' below the main block
  const googleWarning = element.querySelector('.sc-StoreLocator-googleWarning');
  if (googleWarning) contentParts.push(googleWarning);
  const contentRow = [contentParts];

  // Compose table
  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
