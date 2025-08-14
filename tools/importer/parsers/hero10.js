/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as specified
  const headerRow = ['Hero (hero10)'];

  // 2nd row: background image. Only image element from .sc-ResponsiveImg
  let imageCell = '';
  const responsiveImgDiv = element.querySelector('.sc-ResponsiveImg');
  if (responsiveImgDiv) {
    // Prefer the <img> inside .sc-ResponsiveImg
    const imgEl = responsiveImgDiv.querySelector('img');
    if (imgEl) imageCell = imgEl;
    // Edge case: if no <img> but a <picture>, use <picture>
    else {
      const pic = responsiveImgDiv.querySelector('picture');
      if (pic) imageCell = pic;
    }
  }

  // 3rd row: Title/subtitle/cta - use the entire .sc-TitleWrapper block
  let titleCell = '';
  const titleWrapper = element.querySelector('.sc-TitleWrapper');
  if (titleWrapper) titleCell = titleWrapper;

  // Build table cells
  const cells = [
    headerRow,
    [imageCell],
    [titleCell]
  ];

  // Create and replace with the import block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
