/* global WebImporter */
export default function parse(element, { document }) {
  // Block name row as in example
  const headerRow = ['Hero (hero4)'];

  // No background image in this HTML, so row 2 is empty
  const imageRow = [''];

  // For the text: we want to preserve heading hierarchy and style if present
  // The HTML has two spans, one black, one red and script
  // We'll reconstruct this as a single heading (h1) containing both spans, to preserve both style and semantic meaning
  const h1 = document.createElement('h1');
  h1.style.fontWeight = '500'; // same as source
  h1.style.fontSize = '36px'; // fallback for heading size; not strictly required
  
  // Get the two spans
  const spans = element.querySelectorAll('span');
  // Defensive: check if they exist, otherwise fallback to textContent
  if (spans.length > 0) {
    spans.forEach(span => {
      h1.append(span);
      h1.append(' '); // preserve the space in between
    });
    // Remove trailing space
    if (h1.lastChild && h1.lastChild.nodeType === Node.TEXT_NODE && h1.lastChild.textContent.trim() === '') {
      h1.removeChild(h1.lastChild);
    }
  } else {
    h1.textContent = element.textContent;
  }

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    [h1]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
