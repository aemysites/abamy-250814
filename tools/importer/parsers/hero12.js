/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Header row: matches example exactly ---
  const headerRow = ['Hero (hero12)'];

  // --- 2. Background image extraction ---
  // Try to find an <img> inside .sc-StoreLocator-bannerImage
  let bgImgEl = null;
  const bannerImageContainer = element.querySelector('.sc-StoreLocator-bannerImage');
  if (bannerImageContainer) {
    const img = bannerImageContainer.querySelector('img');
    if (img) {
      bgImgEl = img;
    }
  }

  // --- 3. Banner content: all text and call-to-action from the content area ---
  const bannerContentElements = [];
  const bannerContentContainer = element.querySelector('.sc-Banner-content');
  if (bannerContentContainer) {
    // Title and subtitle
    const titleWrapper = bannerContentContainer.querySelector('.sc-TitleWrapper');
    if (titleWrapper) {
      // Directly reference the wrapper for full heading block
      bannerContentElements.push(titleWrapper);
    }
    // Search/CTA block (contains the CTA button, subtitle, input)
    const storeLocatorSearch = bannerContentContainer.querySelector('.sc-StoreLocator-search');
    if (storeLocatorSearch) {
      bannerContentElements.push(storeLocatorSearch);
    }
  }

  // --- 4. Table construction ---
  // 3 rows, 1 column each: header, image, content (all combined)
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''], // image row is empty if no image found
    [bannerContentElements.length > 0 ? bannerContentElements : ''], // content block/empty
  ];

  // --- 5. Replace element with block table ---
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
