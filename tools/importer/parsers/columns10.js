/* global WebImporter */
export default function parse(element, { document }) {
  // Get the social block container
  let socialBlock = element.querySelector('.sc-Footer-social');
  if (!socialBlock) socialBlock = element;

  // Get the title (e.g. 'Nous suivre')
  const title = socialBlock.querySelector('.sc-Footer-socialTitle');
  // Get the list of social icons/links
  const list = socialBlock.querySelector('.sc-Footer-socialList');

  // Compose the cell content by referencing existing elements
  const cellContent = [];
  if (title) cellContent.push(title);
  if (list) cellContent.push(list);

  // Construct the table: header and content row, both with only one column
  const cells = [
    ['Columns (columns10)'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
