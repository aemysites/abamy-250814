/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (matches example exactly)
  const headerRow = ['Cards (cards14)'];

  // Get all card columns (excluding the title column)
  // The title column contains sc-TitleWrapper, so select only columns with .sc-Banner or .sc-Card
  const columns = Array.from(element.querySelectorAll(':scope > .column')).filter(col => 
    col.querySelector('.sc-Banner, figure.sc-Card')
  );

  const rows = [headerRow];

  columns.forEach(col => {
    // Check for Banner card
    const banner = col.querySelector('.sc-Banner');
    if (banner) {
      // Image extraction
      const bannerPicture = banner.querySelector('.sc-Banner-picture picture');
      let bannerImg = null;
      if (bannerPicture) {
        bannerImg = bannerPicture.querySelector('img');
      }
      // Content extraction
      const contentArr = [];
      const bannerTitle = banner.querySelector('.sc-Banner-title');
      if (bannerTitle) contentArr.push(bannerTitle);
      // Find CTA button text/link
      const bannerButton = banner.querySelector('.Button--arrow');
      if (bannerButton) contentArr.push(bannerButton);
      rows.push([
        bannerImg,
        contentArr
      ]);
      return;
    }
    // Check for Card
    const card = col.querySelector('figure.sc-Card');
    if (card) {
      // Image extraction
      const cardImg = card.querySelector('.sc-Card-img img');
      // Text extraction
      const cardTextBlock = card.querySelector('figcaption .sc-Card-text');
      const contentArr = [];
      if (cardTextBlock) {
        // Title: div with centered text
        const titleDiv = cardTextBlock.querySelector('div');
        if (titleDiv) contentArr.push(titleDiv);
        // Description: p tags with actual text
        const paragraphs = Array.from(cardTextBlock.querySelectorAll('p')).filter(p => p.textContent.trim() !== '' || p.querySelector('a'));
        paragraphs.forEach(p => contentArr.push(p));
      }
      rows.push([
        cardImg,
        contentArr
      ]);
      return;
    }
    // If neither Banner nor Card, skip
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with block
  element.replaceWith(block);
}
