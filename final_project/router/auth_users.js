const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; // Extract ISBN from URL
  const review = req.body.review; // Extract review from request body
  const username = req.session.authorization?.username; // Get username from session

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  // Initialize reviews if not already present
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update the review for the current user
  book.reviews[username] = review;

  return res.status(200).send(
  `Review for book with ISBN ${isbn} has been added/updated`
  ); 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; 
  const username = req.session.authorization?.username; 
  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: `No review found for the book by user ${username}` });
  }

 
  delete book.reviews[username];

  return res.status(200).send(
    `Review for book with ISBN ${isbn} has been deleted`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
