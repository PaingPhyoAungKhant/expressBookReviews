const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
// let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", (req, res) => {
   const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
  
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;

  const booksArray = await Object.values(books);
  const filteredBooks = await booksArray.filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks));
  } else {
    return res.status(404).json({ message: "No Book Found by this author" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArray = await Object.values(books);
  const filteredBooks = await booksArray.filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks));
  } else {
    return res.status(404).json({ message: "No Book Found by this title" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = books[isbn].reviews;

  if (reviews && Object.keys(reviews).length > 0) {
    return res.status(200).send(JSON.stringify(reviews));
  } else {
    return res.status(404).json({ message: "No reviews found" });
  }
});



module.exports.general = public_users;
