// API Key for Google Books
const googleApiKey = 'AIzaSyDqGSkd5HDvnafkNLO0n1uQYILVQ0GQhKU';

// Function to search books by title, author, and ISBN
function searchBooks() {
    const query = document.getElementById('bookSearch').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (query === '') {
        resultsDiv.innerHTML = '<p>Please enter a book title, author name, or ISBN.</p>';
        return;
    }

    // Check cache first
    const cachedData = checkCache(query);
    if (cachedData) {
        console.log("Using cached results for:", query);
        displayBooks(cachedData);
        return;
    }

    // Google Books API - Search by title, author, and ISBN
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}+inauthor:${query}+isbn:${query}&maxResults=30&printType=books&orderBy=relevance&langRestrict=en&key=${googleApiKey}`;

    // Open Library API - More books
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${query}&limit=30`;

    fetch(googleBooksUrl)
        .then(response => response.json())
        .then(data => {
            const googleBooks = data.items ? data.items.slice(0, 20) : [];
            fetchOpenLibraryData(openLibraryUrl, googleBooks, query);
        })
        .catch(error => console.error('Error fetching Google Books:', error));
}

// Fetch data from Open Library and combine with Google Books results
function fetchOpenLibraryData(url, googleBooks, query) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const openLibraryBooks = data.docs ? data.docs.slice(0, 20) : [];
            const combinedBooks = mergeBooks(googleBooks, openLibraryBooks, query);
            cacheData(query, combinedBooks);
            displayBooks(combinedBooks);
        })
        .catch(error => console.error('Error fetching Open Library:', error));
}

// Merge books, prioritize same author & series, and include ISBN matches
function mergeBooks(googleBooks, openLibraryBooks, query) {
    const bookSet = new Set();
    const bestMatches = [];
    let mainAuthor = "";
    let mainSeries = "";

    googleBooks.concat(openLibraryBooks).forEach(book => {
        if (bestMatches.length >= 25) return; // Limit results to 25

        const title = (book.volumeInfo?.title || book.title || 'Untitled').toLowerCase();
        const author = (book.volumeInfo?.authors?.[0] || book.author_name?.[0] || 'Unknown').toLowerCase();
        const series = book.volumeInfo?.series || book.series_name || "";
        const isbnList = book.volumeInfo?.industryIdentifiers?.map(id => id.identifier) || [];
        const imageUrl = book.volumeInfo?.imageLinks?.thumbnail || `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` || 'placeholder.jpg';

        let bookId = book.id || (book.key ? `OL-${book.key}` : null);
        if (!bookId) return; // Skip books without valid ID

        // Set main author and series based on first book
        if (bestMatches.length === 0) {
            mainAuthor = author;
            mainSeries = series;
        }

        // Prioritize ISBN matches, then title/series/author
        if (!bookSet.has(bookId)) {
            if (isbnList.includes(query)) {
                bestMatches.unshift({ title, author, imageUrl, bookId, series });
            } else if (title.includes(query.toLowerCase()) || series === mainSeries) {
                bestMatches.splice(2, 0, { title, author, imageUrl, bookId, series });
            } else if (author === mainAuthor) {
                bestMatches.splice(4, 0, { title, author, imageUrl, bookId, series });
            } else {
                bestMatches.push({ title, author, imageUrl, bookId, series });
            }
            bookSet.add(bookId);
        }
    });

    return bestMatches.slice(0, 25); // Return top 25 results
}

// Cache search results but allow multiple searches
function cacheData(query, data) {
    let searchCache = JSON.parse(sessionStorage.getItem("searchCache")) || {};
    searchCache[query] = data;
    sessionStorage.setItem("searchCache", JSON.stringify(searchCache));
}

// Check for cached results
function checkCache(query) {
    let searchCache = JSON.parse(sessionStorage.getItem("searchCache")) || {};
    return searchCache[query] || null;
}

// Display books with title, author, and image
function displayBooks(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear results before displaying

    books.forEach(book => {
        const { title, author, imageUrl, bookId, series } = book;
        const isFavorite = checkFavorite(bookId);

        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-card');
        bookDiv.innerHTML = `
            <a href="book.html?id=${bookId}" class="book-link">
                <img src="${imageUrl}" alt="${title}" />
                <h3>${title}</h3>
                <p>Author: ${author}</p>
                ${series ? `<p>Series: ${series}</p>` : ""}
            </a>
            <span class="heart-icon ${isFavorite ? 'favorite' : ''}" onclick="toggleFavorite('${bookId}', this)">❤️</span>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}

// Function to check if a book is in favorites
function checkFavorite(bookId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(bookId);
}

// Function to add or remove books from favorites and toggle heart color
function toggleFavorite(bookId, element) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(bookId)) {
        favorites = favorites.filter(id => id !== bookId);
        element.classList.remove('favorite');
    } else {
        favorites.push(bookId);
        element.classList.add('favorite');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Enable search by pressing Enter key
document.getElementById('bookSearch').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBooks();
    }
});

// Also allow search on button click
document.getElementById('searchButton').addEventListener('click', function() {
    searchBooks();
});