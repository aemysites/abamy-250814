/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare header row exactly as required
  const rows = [['Cards (cards1)']];

  // 2. Get all carousel slides
  const carrousel = element.querySelector('.sc-Carrousel');
  if (!carrousel) return;
  const slideWrapper = carrousel.querySelector('.sc-Carrousel-wrapper');
  if (!slideWrapper) return;
  const slides = Array.from(slideWrapper.children).filter(child => child.classList.contains('sc-Carrousel-slide'));

  slides.forEach((slide) => {
    // Find card content
    const richText = slide.querySelector('.sc-RichText');
    let image = null;
    if (richText) {
      // Look for an immediate <a> wrapping <img>, or just <img>
      const imgLink = richText.querySelector('a[href] > img');
      if (imgLink) {
        image = imgLink;
      } else {
        const img = richText.querySelector('img');
        if (img) image = img;
      }
    }

    // For the text cell, we want to capture ALL visible overlay text, including headings, descriptions, CTA
    // In this markup, all overlay text (title, description, CTA) is in absolutely positioned divs and/or list items
    // We'll collect all DIVs that do not contain the main image, and all <li> tags (for CTA buttons), and their children
    const textCellContent = [];
    if (richText) {
      // Get all overlay (non-image) content
      // The overlay text block for CTA is usually in a div with style z-index:2
      const overlays = richText.querySelectorAll('div');
      overlays.forEach(div => {
        if (!div.querySelector('img')) {
          // Exclude divs that only contain empty spans (like the counter)
          if (div.textContent.trim() || div.querySelector('a,li,strong,span')) {
            textCellContent.push(div);
          }
        }
      });
      // Also get any <li> (CTA buttons), if not already included
      const lis = richText.querySelectorAll('li');
      lis.forEach(li => {
        if (!textCellContent.includes(li)) textCellContent.push(li);
      });
      // Also, if there's any anchor outside overlays (as text CTA), include if not image link
      const as = richText.querySelectorAll('a');
      as.forEach(a => {
        if (!a.querySelector('img') && !textCellContent.includes(a)) textCellContent.push(a);
      });
    }
    // Edge case: If nothing at all captured, fallback to any paragraph or span in richText
    if (textCellContent.length === 0 && richText) {
      const extras = richText.querySelectorAll('p,span,strong');
      extras.forEach(p => {
        if (p.textContent.trim()) textCellContent.push(p);
      });
    }
    // Final fallback: If still empty, try entire slide
    if (textCellContent.length === 0) {
      textCellContent.push(slide);
    }
    // Add row: [image, text content as array]
    rows.push([
      image,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // 3. Build and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
