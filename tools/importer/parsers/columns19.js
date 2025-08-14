/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child elements of a container
  function getDirectChildren(el) {
    return Array.from(el.children);
  }

  // Ensure we have two columns: left and right
  const left = element.querySelector('.leftContainer');
  const right = element.querySelector('.rightContainer');

  // Column 1 (Left): Compose all meaningful content
  const leftContent = [];
  if (left) {
    // Get bubblesContainer (contains thumb and speech bubble)
    const bubblesContainer = left.querySelector('.bubblesContainer');
    if (bubblesContainer) {
      leftContent.push(bubblesContainer);
    }
    // Get heading, paragraph, button
    const heading = left.querySelector('h3');
    if (heading) leftContent.push(heading);
    const paragraph = left.querySelector('p');
    if (paragraph) leftContent.push(paragraph);
    const button = left.querySelector('a.Button');
    if (button) leftContent.push(button);
  }

  // Column 2 (Right): Main image (not mobile-show version)
  let rightImage = null;
  if (right) {
    rightImage = right.querySelector('img');
  } else if (left) {
    // Fallback if right missing: use .mobile-show img from left
    rightImage = left.querySelector('img.mobile-show');
  }

  // Table header must match spec
  const headerRow = ['Columns (columns19)'];
  // Ensure both columns are present
  const contentRow = [leftContent, rightImage ? [rightImage] : []];

  // Compose and insert table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
