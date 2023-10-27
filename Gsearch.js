const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function performSearch() {
  const searchTerm = searchInput.value;
  require('electron').shell.openExternal(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`);
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting and reloading the page
  performSearch();
});
