/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matching example
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];
  // Each card is a div.sc-Carrousel-slide (direct children)
  const slides = element.querySelectorAll(':scope > div');
  slides.forEach((slide) => {
    // Find <figure> within slide
    const figure = slide.querySelector('figure');
    if (!figure) return;

    // Get image element for first cell
    const img = figure.querySelector('img');
    // Defensive: If no image, skip this card
    if (!img) return;

    // Second cell: Text content
    // Get <figcaption>
    const figcaption = figure.querySelector('figcaption');
    let cardTextContent = null;
    if (figcaption) {
      // Use div.sc-Card-text inside figcaption (contains both title and subtitle)
      const textDiv = figcaption.querySelector('.sc-Card-text') || figcaption;
      cardTextContent = textDiv;
    } else {
      // If no figcaption, fallback to figure
      cardTextContent = figure;
    }

    // Push card row: 2 columns: image, text
    rows.push([img, cardTextContent]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
