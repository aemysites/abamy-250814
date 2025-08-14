/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards21)'];

  // Get all immediate card slides
  const slides = Array.from(element.querySelectorAll(':scope > .sc-Carrousel-slide'));

  const rows = slides.map((slide) => {
    // First cell: image
    const img = slide.querySelector('img');
    // Second cell: the card text (title + description)
    // The text content is in figcaption > div (which contains the <strong> title and <p> description)
    const figcaption = slide.querySelector('figcaption');

    // Defensive: If either image or figcaption is missing, still keep content (fallback to empty node)
    const imgNode = img || document.createTextNode('');
    const textNode = figcaption || document.createTextNode('');

    return [imgNode, textNode];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
