
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzwTDUbzfuInO33rPEapcZlFMHwKF2UuieXrn570n7lQtg1ywwGouhzqmfcFhea-AADuw/exec";

async function fetchBooks() {
  const res = await fetch(SHEET_API_URL);
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books, filter = "name") {
  const container = document.getElementById("book-list");
  container.innerHTML = "";

  let sorted = [...books];
  if (filter === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (filter === "date") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (filter === "size") sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));

  for (let book of sorted) {
    container.innerHTML += `
      <div class="bg-white p-4 shadow rounded">
        <h2 class="text-lg font-bold">${book.title}</h2>
        <p>Size: ${book.size} MB</p>
        <p>Date: ${new Date(book.date).toLocaleDateString()}</p>
        <a href="${book.link}" class="text-blue-600 underline" target="_blank">Download</a>
      </div>
    `;
  }
}

document.getElementById("filter").addEventListener("change", async (e) => {
  const res = await fetch(SHEET_API_URL);
  const books = await res.json();
  renderBooks(books, e.target.value);
});

document.getElementById("search").addEventListener("input", async (e) => {
  const value = e.target.value.toLowerCase();
  const res = await fetch(SHEET_API_URL);
  const books = await res.json();
  const results = books.filter(book => book.title.toLowerCase().includes(value));
  renderBooks(results);
});

fetchBooks();
