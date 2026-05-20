const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * ============================================================================
 * Task 10: Retrieve the complete list of books available in the bookstore
 * Implementation: Using async-await structure to handle asynchronous simulation
 * ============================================================================
 */
public_users.get('/', async (req, res) => {
  try {
    // Simulating an asynchronous database fetch using Promise.resolve
    const storeBooks = await Promise.resolve(books);
    
    // Return the successful response with a 200 OK HTTP status code
    return res.status(200).json(storeBooks);
  } catch (err) {
    // Internal Server Error handling case
    return res.status(500).json({ error: "Failed to fetch the bookstore catalog" });
  }
});

/**
 * ============================================================================
 * Task 11: Get specific book details based on its unique ISBN number
 * Implementation: Using native JavaScript Promise chain (.then/.catch)
 * ============================================================================
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const targetIsbn = req.params.isbn;
  
  // Initiating the promise chain to simulate async behavior
  Promise.resolve(books[targetIsbn])
    .then((foundBook) => {
      // Validate whether the book exists in our local database record
      if (foundBook) {
        return res.status(200).json(foundBook);
      } else {
        // Resource not found error handling
        return res.status(404).json({ error: `Book with ISBN ${targetIsbn} was not found` });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: "An unexpected error occurred while retrieving book details" });
    });
});
  
/**
 * ============================================================================
 * Task 12: Search for all books written by a specified author
 * Implementation: Using async-await pattern along with robust filtering methods
 * ============================================================================
 */
public_users.get('/author/:author', async (req, res) => {
  const requestedAuthor = req.params.author;
  
  try {
    // Resolve the books data object asynchronously
    const dataCatalog = await Promise.resolve(books);
    
    // Standardizing string comparison by applying toLowerCase() to prevent case-sensitive mismatches
    const booksByAuthor = Object.values(dataCatalog).filter(
      currentBook => currentBook.author.toLowerCase() === requestedAuthor.toLowerCase()
    );
    
    // Check if any books match the author's name criteria
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: `No books found matching author: ${requestedAuthor}` });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server encountered an error processing the author query" });
  }
});

/**
 * ============================================================================
 * Task 13: Find book listings matching a specific title
 * Implementation: Using clean Promise syntax with advanced array mapping
 * ============================================================================
 */
public_users.get('/title/:title', (req, res) => {
  const requestedTitle = req.params.title;
  
  Promise.resolve(books)
    .then((allAvailableBooks) => {
      // Filter records across the object values comparing matching lowercased titles
      const matchedTitles = Object.values(allAvailableBooks).filter(
        item => item.title.toLowerCase() === requestedTitle.toLowerCase()
      );
      
      // Verify if the result collection contains any records
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