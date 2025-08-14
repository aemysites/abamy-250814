/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Block name EXACTLY as in the example
  const headerRow = ['Hero (hero6)'];

  // Second row: background image. None found in the element, so leave cell empty string.
  const imageRow = [''];

  // Third row: title as heading, and CTAs as list of links.
  // Extract the title: .sc-navigationMenu-titleName (should exist)
  const titleSpan = element.querySelector('.sc-navigationMenu-titleName');
  let headingEl = null;
  if (titleSpan && titleSpan.textContent.trim()) {
    headingEl = document.createElement('h1');
    headingEl.textContent = titleSpan.textContent.trim();
  }

  // Extract all CTAs: all .sc-navigationMenu-listItem > a
  const ctaLinks = Array.from(element.querySelectorAll('.sc-navigationMenu-listItem > a'));
  let ctaListEl = null;
  if (ctaLinks.length > 0) {
    ctaListEl = document.createElement('ul');
    ctaLinks.forEach(link => {
      const li = document.createElement('li');
      // Use only the label span text as the link text
      const label = link.querySelector('.sc-navigationMenu-listItemLabel');
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      if (label && label.textContent.trim()) {
        a.textContent = label.textContent.trim();
      } else {
        a.textContent = link.textContent.trim(); // fallback to whole link text
      }
      li.appendChild(a);
      ctaListEl.appendChild(li);
    });
  }

  // Compose final cell for the third row
  // Always keep heading first, then list
  const contentRowCell = [];
  if (headingEl) contentRowCell.push(headingEl);
  if (ctaListEl) contentRowCell.push(ctaListEl);
  // If both missing, keep empty string
  const contentRow = [contentRowCell.length > 0 ? contentRowCell : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
