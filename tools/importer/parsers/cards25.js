/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards25)'];

  // Get the columns container
  const columnsContainer = element.querySelector('.columns');
  if (!columnsContainer) return;

  // Only process columns containing a card figure
  const cardColumns = Array.from(columnsContainer.children).filter(col => col.querySelector('figure.sc-Card'));

  // For each card, build [image, text] and make sure we extract all possible text, including titles and descriptions
  const cardRows = cardColumns.map(col => {
    const figure = col.querySelector('figure.sc-Card');
    if (!figure) return null;

    // Get image
    const img = figure.querySelector('.sc-Card-img img');

    // Get all text content from figcaption and related text nodes
    const figcaption = figure.querySelector('figcaption');
    let textElements = [];
    if (figcaption) {
      // Get all elements and text nodes with non-empty content
      Array.from(figcaption.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.textContent.trim()) {
          textElements.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          textElements.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
    // Additionally extract any relevant sibling descriptive text (sometimes outside figcaption)
    // For robustness, check if there is a sc-Card-text (description) element outside figcaption
    const cardText = figure.querySelector('.sc-Card-text');
    if (cardText && cardText !== figcaption) {
      Array.from(cardText.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.textContent.trim()) {
          textElements.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          textElements.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
    // If still empty, fallback to any card title base
    if (textElements.length === 0) {
      const cardTitle = figure.querySelector('.sc-Card-titleBase');
      if (cardTitle) {
        Array.from(cardTitle.childNodes).forEach(node => {
          if (node.nodeType === 1 && node.textContent.trim()) {
            textElements.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            textElements.push(document.createTextNode(node.textContent.trim()));
          }
        });
      }
    }
    // Compose the row
    return [img, textElements];
  }).filter(Boolean);

  // Compose the table
  const tableArray = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(blockTable);
}
