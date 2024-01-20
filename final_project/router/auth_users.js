const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }
    
const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});
  
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.user.username; // Assuming the user is authenticated and the username is stored in req.user
  
    const bookArray = Object.values(books);
    const book = bookArray.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Add or modify review
    book.reviews[username] = review;
  
    return res.status(200).json({ message: "Review added or modified successfully", review });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username; // Assuming the user is authenticated and the username is stored in req.user
    const bookArray = Object.values(books);
    const book = bookArray.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (book) {
      // Delete the user's review
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
