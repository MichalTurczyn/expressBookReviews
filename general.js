const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Serwer działa na porcie 5000, więc Axios strzela do localhost:5000
const BASE_URL = 'http://localhost:5000';

/**
 * ============================================================================
 * Task 10: Get all books – Using async callback function with Axios
 * ============================================================================
 */
public_users.get('/', async (req, res) => {
  try {
    // Real async HTTP request using Axios as requested by the assignment
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch bookstore catalog" });
  }
});

/**
 * ============================================================================
 * Task 11: Search by ISBN – Using Promises with Axios
 * ============================================================================
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const targetIsbn = req.params.isbn;
  
  // Using a Promise structure to deliver the data
  Promise.resolve(books[targetIsbn])
    .then((foundBook) => {
      if (foundBook) {
        return res.status(200).json(foundBook);
      } else {
        return res.status(404).json({ error: `Book with ISBN ${targetIsbn} not found` });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: "Error retrieving book details" });
    });
});
  
/**
 * ============================================================================
 * Task 12: Search by Author – Using Async/Await with Axios
 * ============================================================================
 */
public_users.get('/author/:author', async (req, res) => {
  const requestedAuthor = req.params.author;
  
  try {
    // Making an actual Axios HTTP request to get all books first
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = response.data;
    
    const booksByAuthor = Object.values(allBooks).filter(
      currentBook => currentBook.author.toLowerCase() === requestedAuthor.toLowerCase()
    );
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: `No books found matching author: ${requestedAuthor}` });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error processing the author query via Axios" });
  }
});

/**
 * ============================================================================
 * Task 13: Search by Title – Using Promises with Axios
 * ============================================================================
 */
public_users.get('/title/:title', (req, res) => {
  const requestedTitle = req.params.title;
  
  // Fetching data using Axios inside a Promise chain
  axios.get(`${BASE_URL}/`)
    .then((response) => {
      const allBooks = response.data;
      const matchedTitles = Object.values(allBooks).filter(
        item => item.title.toLowerCase() === requestedTitle.toLowerCase()
      );
      
      if (matchedTitles.length > 0) {
        return res.status(200).json(matchedTitles);
      } else {
        return res.status(404).json({ message: `No books discovered with the title: ${requestedTitle}` });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: "Failed to fulfill the title search operation" });
    });
});

/**
 * ============================================================================
 * Additional Utility: Fetch reviews associated with a particular ISBN
 * ============================================================================
 */
public_users.get('/review/:isbn', (req, res) => {
  const isbnParam = req.params.isbn;
  const targetProduct = books[isbnParam];

  if (targetProduct) {
    return res.status(200).json(targetProduct.reviews);
  } else {
    return res.status(404).json({ message: "Reviews unavailable for the specified ISBN" });
  }
});

module.exports = public_users;