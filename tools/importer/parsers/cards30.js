/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel wrapper containing card slides
  const wrapper = element.querySelector('.sc-Carrousel-wrapper');
  if (!wrapper) return;

  // Collect unique card slides by img src or label text
  const allSlides = Array.from(wrapper.querySelectorAll(':scope > .sc-Carrousel-slide'));
  const seen = new Set();
  const slides = [];
  allSlides.forEach(slide => {
    let key = '';
    const img = slide.querySelector('img');
    if (img && img.src) {
      key = img.src;
    } else {
      // fallback: try to get label text
      const label = slide.querySelector('div[style*="background-color: white"]');
      if (label) key = label.textContent.trim();
    }
    if (key && !seen.has(key)) {
      seen.add(key);
      slides.push(slide);
    }
  });

  // Prepare table: header row first
  const cells = [['Cards (cards30)']];

  // For each slide, extract image/icon and all text content (label, any other visible text)
  slides.forEach(slide => {
    // First cell: the image or icon (reference DOM directly)
    let imgOrIcon = null;
    let img = slide.querySelector('img');
    if (img) {
      imgOrIcon = img;
    } else {
      let icon = slide.querySelector('.icon');
      if (icon) imgOrIcon = icon;
    }
    // Second cell: all text content in the card
    // Use all visible text in the clickable area, keeping original elements if possible
    let textCellContent = [];
    // Get the main clickable block (usually <a>), or fallback to the slide
    const mainBlock = slide.querySelector('a') || slide;
    // Find the main label (usually white background)
    const labelDiv = mainBlock.querySelector('div[style*="background-color: white"]');
    if (labelDiv && labelDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = labelDiv.textContent.trim();
      textCellContent.push(strong);
    }
    // Find any other text that isn't the label
    function extractOtherText(node, skip) {
      let arr = [];
      if (node === skip) return arr;
      for (const child of node.childNodes) {
        if (child === skip) continue;
        if (child.nodeType === Node.TEXT_NODE) {
          const txt = child.textContent.trim();
          if (txt) {
            arr.push(txt);
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          arr.push(...extractOtherText(child, skip));
        }
      }
      return arr;
    }
    const extraTexts = extractOtherText(mainBlock, labelDiv);
    extraTexts.forEach(t => {
      const div = document.createElement('div');
      div.textContent = t;
      textCellContent.push(div);
    });
    if (textCellContent.length === 0) {
      // fallback: empty string so cell is never empty
      textCellContent.push('');
    }
    cells.push([imgOrIcon, textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
