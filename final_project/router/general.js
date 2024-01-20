const axios = require('axios'); // Import Axios library
const { promisify } = require('util'); // Import promisify from util module

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/",(req,res)=>{

    // Update the code here
  
    res.send(JSON.stringify(books,null,4));
  });

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // Add user registration logic here
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookArray = Object.values(books);
    const book = bookArray.find(book => book.isbn === isbn);
    if (book) {
      return res.status(200).json({ book: book });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });
  
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookArray = Object.values(books);
    const matchingBooks = bookArray.filter(book => book.author === author);
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: 'Books by author not found' });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookArray = Object.values(books);
    const matchingBooks = bookArray.filter(book => book.title === title);
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: 'Books by title not found' });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookArray = Object.values(books);
    const book = bookArray.find(book => book.isbn === isbn);
    if (book && book.reviews) {
      return res.status(200).json({ reviews: book.reviews });
    } else {
      return res.status(404).json({ message: 'Reviews not found for the book' });
    }
  });
  


// Task 10: Get the list of books using Promise callbacks or async-await with Axios
public_users.get("/", async (req, res) => {
  try {
    // Using Axios to make a GET request
    const response = await axios.get('url_to_get_books_list');
    const bookList = response.data;
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    // Using Axios to make a GET request
    const response = await axios.get(`url_to_get_book_details_by_isbn/${isbn}`);
    const book = response.data;
    return res.status(200).json({ book: book });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 12: Get book details based on author using Promise callbacks or async-await with Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    // Using Axios to make a GET request
    const response = await axios.get(`url_to_get_books_by_author/${author}`);
    const matchingBooks = response.data;
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: 'Books by author not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 13: Get book details based on title using Promise callbacks or async-await with Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    // Using Axios to make a GET request
    const response = await axios.get(`url_to_get_books_by_title/${title}`);
    const matchingBooks = response.data;
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: 'Books by title not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports.general = public_users;
