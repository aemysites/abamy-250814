/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main block containers
  const mainContainer = element.querySelector(':scope > .mainContainer');
  if (!mainContainer) return;
  const flex = mainContainer.querySelector(':scope > .flex');
  if (!flex) return;
  const leftContainer = flex.querySelector(':scope > .leftContainer');
  const rightContainer = flex.querySelector(':scope > .rightContainer');

  // Prepare left column content
  let leftParts = [];
  if (leftContainer) {
    // bubblesContainer contains first img and bubbles (3 divs of text)
    const bubblesContainer = leftContainer.querySelector(':scope > .bubblesContainer');
    if (bubblesContainer) leftParts.push(bubblesContainer);

    // mobile-show image (displays on mobile)
    const mobileShowImg = leftContainer.querySelector('img.mobile-show');
    if (mobileShowImg) leftParts.push(mobileShowImg);

    // Heading and paragraph describing adaptation to styles
    const heading = leftContainer.querySelector('h3');
    if (heading) leftParts.push(heading);
    const paragraph = leftContainer.querySelector('p');
    if (paragraph) leftParts.push(paragraph);
  }

  // Prepare right column content
  let rightParts = [];
  if (rightContainer) {
    // Only take image(s) (no text in original)
    const imgs = rightContainer.querySelectorAll('img');
    imgs.forEach(img => rightParts.push(img));
  }

  // Guarantee at least two columns for the table (even if one side is missing)
  const headerRow = ['Columns (columns17)'];
  const contentRow = [leftParts, rightParts];

  // Create and insert the table block
  const block = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(block);
}
