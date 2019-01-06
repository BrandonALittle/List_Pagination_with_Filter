
// Create global reference to entire student list.
const allStudents = getAllStudents();

/**
 * Creates a closure on original student list, returns a function that always returns the original list.
 */
function getAllStudents() {
  const studentList = document.querySelector('.student-list');
  return function() {
    return studentList.children;
  }
}

/**
 * Shows items on the current page and hides all others.
 * @param {HTML collection} list - Collection of LI elements to hide/display according to pagination.
 * @param {Integer} page - Current page to display.
 */
function showPage(list, page) {
  const firstIndex = page * 10; // first item to show
  const lastIndex = firstIndex + 10; // last item to show
  for (let i = 0; i < list.length; i++) { // for current range indicated by PAGE parameter
    if (i >= firstIndex && i < lastIndex) {
      list[i].style.display = "inherit"; // show items in range
    } else {
      list[i].style.display = "none"; // hide items out of range
    }
  }
}

/**
 * Creates a list of pagination links and attaches them to the DOM.
 * @param {HTML collection} list - Collection of LI elements to create pagination links.
 */
function appendPageLinks(list) {
  const numberPages = Math.ceil(list.length / 10); // get number of pagination links to create
  const paginationDiv = getPaginationDiv(); 
  const pageList = paginationDiv.querySelector('ul'); // get <ul> child element

  for (let i = 0; i < numberPages; i++) {
    let page = document.createElement('li'); // create list item for each pagination link
    page.innerHTML = `<a href="#">${i + 1}</a>`; // add link 

    page.addEventListener('click', e => { // when clicked, list item
      let pageNumber = e.target.textContent - 1;
      showPage(list, pageNumber); // shows current page
      let active = pageList.querySelector('.active'); 
      if (active) {
        active.className = '';
      }
      e.target.className = "active"; // sets current page link to active, all others to inactive
    });
    pageList.appendChild(page);
  } 
  paginationDiv.appendChild(pageList);
  if (list.length > 10) {
    document.querySelector('.page').appendChild(paginationDiv); // append to DOM
  }
}

/**
 * Returns a <div> element to hold pagination links; removes current pagination div from DOM.
 */
function getPaginationDiv() {
  const pagination = document.querySelector('.pagination'); // gets current pagination <div>
  if (pagination) { 
    const page = pagination.parentNode;
    page.removeChild(pagination); // remove from DOM
  }
  const pageListDiv = document.createElement('div'); // create new <div>
  pageListDiv.className = 'pagination';
  const pageList = document.createElement('ul'); // and <ul>
  pageListDiv.appendChild(pageList); // append to DOM
  return pageListDiv; // return <div>
}

/**
 * Searches all students for target string, inserts results into DOM, replacing current list.
 * @param {String} target - Target string for search.
 */
function handleSearch(target) {
  let results = performSearch(allStudents(), target); // searches all students for matches
  let currentList = document.querySelector('.student-list');
  let page = document.querySelector('.page');
  let pagination = document.querySelector('.pagination');
  page.removeChild(currentList);
  page.insertBefore(results, pagination); // replaces current list with new list
  
  paginate(results.children); // paginates current list
}

/**
 * Creates search field input and button; adds event listeners for search; inserts containing div into DOM.
 */
function addSearchButton() {
  const div = document.createElement('div');
  div.className = "student-search";

  const searchField = document.createElement('input');
  searchField.type = 'text';
  searchField.placeholder = 'Search for students...'

  const button = document.createElement('button');
  button.textContent = 'Search';

  // adds event listeners for either click or change in input
  button.addEventListener('click', () => { handleSearch(searchField.value) });
  searchField.addEventListener('input', () => { handleSearch(searchField.value) });

  div.appendChild(searchField);
  div.appendChild(button);
  document.querySelector('.page-header').appendChild(div); // attaches to DOM
}

/**
 * Searches HTML collection for items where STUDENT NAME matches search string; matches are copied to new <ul> and returned.
 * @param {HTML collection} list - Collection of <li> nodes.
 * @param {String} searchString - Target for search.
 */
function performSearch(list, searchString) {
  const regex = new RegExp(searchString); // create RegExp from search string input
  const resultsList = document.createElement('ul'); // creates new list
  resultsList.className = 'student-list';

  const noResultsMessage = document.createElement('li');
  noResultsMessage.textContent = 'Your search returned 0 results. Please search again.';
  
  for (let i = 0; i < list.length; i++) {
    let studentName = list[i].querySelector('h3').textContent; // check current item for match
    let studentEmail = list[i].querySelector('.email').textContent;
    if (regex.test(studentName)) { 
      let copy = list[i].cloneNode(true); // copy matches to new list
      resultsList.appendChild(copy);
    }
  }

  if (!resultsList.children.length) {
    resultsList.appendChild(noResultsMessage); // if no results, show message
  }

  return resultsList;
}

/**
 * Shows current page and adds appropriate pagination links to page.
 * @param {HTML Collection} list - Collection of list items to be paginated.
 */
function paginate(list) {
  showPage(list, 0);
  appendPageLinks(list);
}

/**
 * Sets current list to all students; paginates list; adds search button.
 */
document.addEventListener('DOMContentLoaded', () => {
  const students = allStudents();
  paginate(students);
  addSearchButton();
});