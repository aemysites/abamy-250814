/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches the example exactly
  const headerRow = ['Search'];

  // 2. Extract all relevant visible content from the element, retaining semantic meaning
  // Use the .sc-Banner-content block, which contains all headings, subtitles, and the search UI
  let contentBlock = element.querySelector('.sc-Banner-content');

  // If .sc-Banner-content is missing (edge case), fallback to the full element
  if (!contentBlock) {
    contentBlock = element;
  }

  // 3. Add the canonical query index link, as per example
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // 4. Table row: single cell containing both full content block and canonical query index link
  const contentRow = [[contentBlock, link]];

  // 5. Build and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
