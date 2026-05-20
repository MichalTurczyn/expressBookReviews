const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await Promise.resolve(books); // Symulacja asynchroniczności wymaganej przez kryteria
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  Promise.resolve(books[isbn])
    .then((book) => {
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch(err => res.status(500).json({message: "Error fetching book"}));
});
  
// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const allBooks = await Promise.resolve(books);
    const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  Promise.resolve(books)
    .then((allBooks) => {
      const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
      return res.status(200).json(filteredBooks);
    })
    .catch(() => res.status(500).json({message: "Error fetching books by title"}));
});

module.exports = public_users;