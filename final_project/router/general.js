const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookList = Object.values(books);

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password)
  {
    if( (users.filter( (user) => (user.username == username))).length > 0 )    
      return res.status(200).json({message: "User already exists"});
    else
    {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "Customer successfully registered. Now " + username + " can login."})
    }
  }
  else{
    return res.send('Missing username/password');
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  listBooks_Promise()
    .then(data => {res.status(200).json({books:data})})
    .catch(err => {res.status(204).json(err)})
});

const listBooks_Promise = () => new Promise((resolve, reject)=>{
  if(bookList.length > 0){
    resolve(books)
  }
  else{
    reject({err:"Empty result"});
  }
})



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  bookDetails_Promise(isbn)
    .then(data => {res.status(200).json(data)})
    .catch(err => {res.status(204).json(err)})
 });

const bookDetails_Promise = (isbn) =>
  new Promise((resolve, reject) => {
    if(!books[isbn]){
      reject("Book with ISBN " + isbn + " isn't in our book catalogue.");
    }
    else {
      resolve(books[isbn]);
    }
})



  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  booksByAuthor_Promise(author)
    .then(data => res.status(200).json({booksByAuthor:data}))
    .catch(err => res.status(204).json(err))
});

const booksByAuthor_Promise = (author) => new Promise((resolve, reject) => {
  let authorBooks = bookList.filter( book => (book.author == author) );
  if(authorBooks.length > 0){
    resolve(authorBooks)
  }
  else{
    reject("There are no books by author " + author + ". Please note the author search is case sensitive so far");
  }
})




// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  
  booksByTitle_Promise(title)
    .then(data => res.status(200).json({booksByTitle:data}))
    .catch(err => res.status(204).json({err}))
  //return res.status(300).json({message: "Yet to be implemented"});
});

const booksByTitle_Promise = (title) => new Promise((resolve, reject)=>{
  let booksByTitle = bookList.filter(book => (book.title == title) )
  
  if(booksByTitle.length > 0){
    resolve(booksByTitle);
  }
  else {
    reject("There are no books by title " + title + ". Please note the title search is case sensitive so far");
  }
})






//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  
    if (books[isbn])
      res.status(200).json(books[isbn].reviews);
    else
      res.status(200).json({message: "Book with ISBN " + isbn + " isn't in our book catalogue."})
});

module.exports.general = public_users;
