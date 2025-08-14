/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];
  // Get all columns (card containers)
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    // Each column contains a figure.sc-Card
    const card = col.querySelector('figure.sc-Card');
    if (!card) return;

    // Image cell: find the <img> element in the card
    let imgEl = null;
    const imgDiv = card.querySelector('.sc-Card-img');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imgEl = img;
    }

    // Text cell: use figcaption
    let textCell = [];
    const figcaption = card.querySelector('figcaption');
    if (figcaption) {
      // Only take the .sc-Card-text.sc-Card-titleBase element inside figcaption
      const textBlock = figcaption.querySelector('.sc-Card-text.sc-Card-titleBase');
      if (textBlock) {
        textCell.push(textBlock);
      } else {
        // Fallback: use the whole figcaption if needed
        textCell.push(figcaption);
      }
    }

    // Push this card row
    cells.push([imgEl, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}