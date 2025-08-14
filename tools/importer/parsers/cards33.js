/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example precisely
  const header = ['Cards (cards33)'];
  
  // Find columns containing sc-Card figures (the cards)
  const columns = element.querySelectorAll(':scope > div.columns > div.column');
  
  // Find the intro (heading and description)
  let introContent = [];
  for (const col of columns) {
    const richText = col.querySelector('.sc-RichText');
    if (richText) {
      // Get both desktop and mobile headings
      const desktopTitle = richText.querySelector('.mobile-hide');
      const mobileTitle = richText.querySelector('.mobile-show');
      if (desktopTitle) introContent.push(desktopTitle);
      if (mobileTitle) introContent.push(mobileTitle);
      // Get all paragraphs (usually just one)
      const paragraphs = richText.querySelectorAll('p');
      paragraphs.forEach(p => introContent.push(p));
      break; // Only one intro
    }
  }
  
  // Gather all cards
  const cardRows = [];
  for (const col of columns) {
    const card = col.querySelector('figure.sc-Card');
    if (!card) continue;
    const img = card.querySelector('img');
    // Find title (in figcaption, strong)
    let title = null;
    const strong = card.querySelector('figcaption strong');
    if (strong) {
      // Use h3 for heading, preserve strong styling
      const h3 = document.createElement('h3');
      h3.innerHTML = strong.innerHTML;
      title = h3;
    }
    // Only the title is present as text; no extra description or CTA
    const textCell = [];
    if (title) textCell.push(title);
    // Defensive: skip empty cards
    if (img || textCell.length) {
      cardRows.push([img, textCell]);
    }
  }

  // Compose table
  const rows = [header];
  if (introContent.length) {
    rows.push([introContent]);
  }
  cardRows.forEach(row => rows.push(row));

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
