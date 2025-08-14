/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Hero (hero16)'];

  // Locate the main content wrapper
  const richText = element.querySelector('.sc-RichText');
  if (!richText) return;

  // Get the headline area (prefer desktop but fallback to mobile)
  let headlineDiv = richText.querySelector('.mobile-hide');
  if (!headlineDiv) headlineDiv = richText.querySelector('.mobile-show');

  // Compose a heading using the headline spans, preserving formatting
  let heading;
  if (headlineDiv) {
    // Semantic meaning: put both spans together in a single h1
    heading = document.createElement('h1');
    // Reference existing children directly (not cloning)
    Array.from(headlineDiv.childNodes).forEach((node) => {
      heading.appendChild(node);
    });
  }

  // Get the description paragraph
  const para = richText.querySelector('p');

  // Compose cell content: heading (optional) + paragraph (optional)
  const blockContent = [];
  if (heading) blockContent.push(heading);
  if (para) blockContent.push(para);

  // Build table as per example: 1 column, 3 rows, header, bg image (empty), content
  const cells = [
    headerRow,
    [''],
    [blockContent]
  ];

  // Create and replace element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
