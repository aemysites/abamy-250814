/* global WebImporter */
export default function parse(element, { document }) {
  // Create table header row
  const cells = [['Cards (cards32)']];

  // Select all card slides directly under the carousel wrapper
  const wrapper = element.querySelector('.sc-Carrousel-wrapper');
  if (!wrapper) return;
  const slides = wrapper.querySelectorAll(':scope > .sc-Carrousel-slide, :scope > .swiper-slide');

  slides.forEach((slide) => {
    // Find the primary figure/card
    const figure = slide.querySelector('figure');
    if (!figure) return;

    // Image cell: get the <img> inside picture
    let imgCell = null;
    const img = figure.querySelector('img');
    if (img) {
      imgCell = img;
    }

    // Text cell: use the figcaption structure
    let textCell = '';
    const figcaption = figure.querySelector('figcaption');
    if (figcaption) {
      // Try to keep strong tag as heading, reference existing element
      const strong = figcaption.querySelector('strong');
      if (strong) {
        // Reference the actual strong element, not clone
        textCell = strong;
      } else {
        // Fallback: use all text content from figcaption
        textCell = figcaption.textContent.trim();
      }
    }

    cells.push([imgCell, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
