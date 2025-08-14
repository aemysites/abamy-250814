/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Table Header Row ---
  const headerRow = ['Hero (hero8)'];

  // --- 2. Background Image Row ---
  let bgImg = '';
  // Look for .sc-ResponsiveImg > picture > img (use existing element)
  const responsiveImg = element.querySelector('.sc-ResponsiveImg');
  if (responsiveImg) {
    const picture = responsiveImg.querySelector('picture');
    if (picture) {
      // Find the first <img> within <picture>
      const img = picture.querySelector('img');
      if (img) {
        bgImg = img;
      }
    }
  }

  // --- 3. Text Block Row (title/subheading, etc) ---
  let textBlock = '';
  // The .sc-TitleWrapper contains the main heading (and icon)
  const titleWrapper = element.querySelector('.sc-TitleWrapper');
  if (titleWrapper) {
    textBlock = titleWrapper;
  }

  // --- 4. Compose Table Rows ---
  const rows = [
    headerRow,
    [bgImg],
    [textBlock],
  ];

  // --- 5. Create and Replace ---
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
