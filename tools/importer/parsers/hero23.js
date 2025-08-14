/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Hero (hero23)'];

  // Extract the desktop columns block for desktop background and content
  const columns = element.querySelectorAll('.columns');
  let desktopCol = Array.from(columns).find(col => col.classList.contains('mobile-hide')) || columns[0];

  // --- Background Image Row ---
  let bgImgEl = null;
  if (desktopCol) {
    const styleAttr = desktopCol.getAttribute('style') || '';
    const urlMatch = styleAttr.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch) {
      const bgImageUrl = urlMatch[1];
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImageUrl;
      bgImgEl.alt = '';
      // Set width and height if possible (width param from url, height from context)
      let wMatch = bgImageUrl.match(/w=(\d+)/);
      if (wMatch) bgImgEl.width = parseInt(wMatch[1], 10);
      bgImgEl.height = 415; // Example screenshot height
    }
  }

  // --- Content Row ---
  // Get the text column (the first .column inside the desktopCol)
  let textColumn = desktopCol ? desktopCol.querySelector('.column') : null;

  let contentCell = [];
  if (textColumn) {
    // The actual text is inside a nested div, get all its children
    // Find the deepest div inside textColumn
    let deepest = textColumn;
    while (deepest.querySelector('div')) {
      deepest = deepest.querySelector('div');
    }
    // Get all childNodes (including text, links, paragraphs)
    contentCell = Array.from(deepest.childNodes).filter(node => {
      // Retain elements and non-empty text nodes
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
    });
    // If nothing found, fallback to textColumn children
    if (contentCell.length === 0) {
      contentCell = Array.from(textColumn.childNodes).filter(node => {
        return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
      });
    }
    // As a final fallback, reference the textColumn itself
    if (contentCell.length === 0) {
      contentCell = [textColumn];
    }
  }

  // Compose table cells: each row is a single column
  const cells = [
    headerRow,
    [bgImgEl],
    [contentCell]
  ];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
