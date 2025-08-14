/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the table header, matching example
  const headerRow = ['Hero (hero29)'];

  // 2. Extract background image from the style attribute of the first direct descendant with background
  let bgImgCell = '';
  let bgDiv = element.querySelector('[style*="background"]');
  let bgImgUrl = '';
  if (bgDiv) {
    // Try to extract url from background property
    let backgroundStyle = bgDiv.style.background || bgDiv.getAttribute('style') || '';
    const urlMatch = backgroundStyle.match(/url\((?:'|")?([^'")]+)(?:'|")?\)/);
    if (urlMatch && urlMatch[1]) {
      bgImgUrl = urlMatch[1];
    }
  }
  if (bgImgUrl) {
    // Use an <img> tag as in the markdown example
    const img = document.createElement('img');
    img.src = bgImgUrl;
    img.alt = '';
    bgImgCell = img;
  }

  // 3. Extract the text content (headline, subheading, CTA)
  // The structure is: ...<div class="columns" ...><div class="column ..."><div><div><p>...</p>...</div></div></div></div>
  // We need the central column (not empty), deepest <div> with <p> and <a>
  let contentCell = '';
  if (bgDiv) {
    // Find the non-empty content column among immediate children
    const columns = bgDiv.querySelectorAll(':scope > .column');
    let contentCol = null;
    for (const col of columns) {
      if (col.textContent.trim().length > 0) {
        contentCol = col;
        break;
      }
    }
    if (contentCol) {
      // Find the inner-most <div> with content
      let mainContent = contentCol;
      let searching = true;
      while (searching) {
        const childrenDivs = mainContent.querySelectorAll(':scope > div');
        if (childrenDivs.length === 1) {
          mainContent = childrenDivs[0];
        } else {
          searching = false;
        }
      }
      // Only use immediate <p> and <a> children of mainContent to keep semantic grouping
      const nodes = [];
      mainContent.childNodes.forEach((node) => {
        if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'A')) {
          nodes.push(node);
        }
      });
      if (nodes.length > 0) {
        // If only one node, use as-is; otherwise group in a div
        if (nodes.length === 1) {
          contentCell = nodes[0];
        } else {
          const groupDiv = document.createElement('div');
          nodes.forEach(n => groupDiv.appendChild(n));
          contentCell = groupDiv;
        }
      } else {
        // fallback: use mainContent if it has content
        if (mainContent.textContent.trim().length > 0) {
          contentCell = mainContent;
        }
      }
    }
  }

  // 4. Compose the table rows (1 column, 3 rows)
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // 5. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
