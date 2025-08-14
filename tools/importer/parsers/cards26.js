/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as in example
  const headerRow = ['Cards (cards26)'];

  // Get only content columns (ignore spacers)
  const cardColumns = Array.from(element.querySelectorAll(':scope > div'))
    .filter(div => div.querySelector('.sc-QuizAccessImage'));

  const rows = [];
  cardColumns.forEach(col => {
    const card = col.querySelector('.sc-QuizAccessImage');
    if (!card) return;

    // -- Left cell: image/icon --
    let imageCell = '';
    // Find image in .sc-QuizAccessImage-image
    const imgWrap = card.querySelector('.sc-QuizAccessImage-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imageCell = img;
    }

    // -- Right cell: text content --
    const contentWrap = card.querySelector('.sc-QuizAccessImage-content');
    let rightCellContent = [];
    if (contentWrap) {
      // Heading (h2)
      const heading = contentWrap.querySelector('h2');
      if (heading) rightCellContent.push(heading);
      // Description (paragraph)
      const paragraph = contentWrap.querySelector('p');
      if (paragraph) rightCellContent.push(paragraph);
      // CTA Button
      const ctaDiv = contentWrap.querySelector('div a.Button, div a.ButtonQuizz--tertiary');
      if (ctaDiv) rightCellContent.push(ctaDiv);
    }
    // If no heading/paragraph/button, fallback to everything in contentWrap
    let rightCell;
    if (rightCellContent.length > 0) {
      rightCell = rightCellContent;
    } else if (contentWrap) {
      rightCell = contentWrap;
    } else {
      rightCell = '';
    }
    rows.push([imageCell, rightCell]);
  });

  // Compose final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
