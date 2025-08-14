/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, exactly as in the example
  const headerRow = ['Cards (cards18)'];

  // Find the slides wrapper containing all the cards
  const slidesWrapper = element.querySelector('.sc-Carrousel-wrapper');
  if (!slidesWrapper) {
    // If not found, do nothing
    return;
  }
  const slideNodes = Array.from(slidesWrapper.children).filter(slide => slide.matches('.sc-Carrousel-slide'));

  const rows = slideNodes.map((slide) => {
    // Get the card image (img element)
    const img = slide.querySelector('.sc-Card-img img');
    // For the text cell, get the figcaption > div.sc-Card-titleBase, which contains the title in <strong>
    const textDiv = slide.querySelector('figcaption .sc-Card-titleBase');

    let textCell;
    if (textDiv) {
      // Use the div directly if it exists (preserving all formatting)
      textCell = textDiv;
    } else {
      textCell = '';
    }
    // Reference the DOM img and textDiv directly (do not clone)
    return [img, textCell];
  });

  // Compose table: header + card rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
