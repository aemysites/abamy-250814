/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must exactly match the example
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Find all direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // The first column is a super-title section, skip it
  let cardColumns = columns.slice(1);

  cardColumns.forEach((col) => {
    // Card type 1: Banner (with CTA and image)
    const banner = col.querySelector('.sc-Banner');
    if (banner) {
      // Banner image (mandatory, in picture > img)
      let imgEl = null;
      const picDiv = banner.querySelector('.sc-Banner-picture');
      if (picDiv) {
        imgEl = picDiv.querySelector('img');
      }
      // Banner content: title, CTA
      const textContent = [];
      const bannerTitle = banner.querySelector('.sc-Banner-title');
      if (bannerTitle) textContent.push(bannerTitle);
      // Only the visible CTA (has .Button--arrow class)
      const ctaBtn = banner.querySelector('a.Button--arrow');
      if (ctaBtn) textContent.push(ctaBtn);
      cells.push([
        imgEl,
        textContent
      ]);
      return;
    }
    // Card type 2: Figure Card
    const card = col.querySelector('figure.sc-Card');
    if (card) {
      // Image (mandatory)
      let imgEl = null;
      const imgBox = card.querySelector('.sc-Card-img');
      if (imgBox) {
        imgEl = imgBox.querySelector('img');
      }
      // Text cell
      const textCol = [];
      const figcaption = card.querySelector('figcaption');
      if (figcaption) {
        // Title: .mobile-hide or .mobile-show span within the center-aligned div
        const titleDiv = figcaption.querySelector('div[style*="text-align: center"]');
        if (titleDiv) {
          // Get both mobile-hide and mobile-show, to be resilient
          let titleSpan = titleDiv.querySelector('.mobile-hide');
          if (!titleSpan) titleSpan = titleDiv.querySelector('.mobile-show');
          if (titleSpan) textCol.push(titleSpan);
        }
        // Description
        // The description is in a <p style="text-align: center;"> > span (not the title div)
        const descPara = Array.from(figcaption.querySelectorAll('p[style*="text-align: center"]'))
          .find(p => p.querySelector('span'));
        if (descPara) {
          const descSpan = descPara.querySelector('span');
          if (descSpan) textCol.push(descSpan);
        }
        // CTA: .Button--secondary
        const cta = figcaption.querySelector('a.Button--secondary');
        if (cta) textCol.push(cta);
      }
      cells.push([
        imgEl,
        textCol
      ]);
      return;
    }
    // If structure changes unexpectedly, fallback: try to grab a single image and all text
    const imgEl = col.querySelector('img');
    const textEls = Array.from(col.querySelectorAll('p, a, span, div'));
    cells.push([
      imgEl,
      textEls
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
