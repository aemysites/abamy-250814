/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards5)'];
  const cardColumns = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];

  cardColumns.forEach(col => {
    // Find the <figure> element (card container)
    const fig = col.querySelector('figure');
    if (!fig) return;

    // Find the image (first <img> inside <figure>)
    const imgEl = fig.querySelector('img');

    // Find the text content, typically inside figcaption > div > p > strong
    let textContent = null;
    const caption = fig.querySelector('figcaption');
    if (caption) {
      // Look for <strong> for heading, fallback to <p>
      const strong = caption.querySelector('strong');
      if (strong) {
        textContent = strong;
      } else {
        const p = caption.querySelector('p');
        if (p) {
          textContent = p;
        } else {
          // If neither, take caption itself
          textContent = caption;
        }
      }
    }
    // Defensive: fallback empty cell if no image/text found
    rows.push([
      imgEl || document.createTextNode(''),
      textContent || document.createTextNode('')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
