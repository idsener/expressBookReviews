const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let bookList = Object.values(books);

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  console.log("users "+ JSON.stringify(users));

  if(username && password)
  {
    if( (users.filter( (user) => (user.username == username))).length > 0 )    
      return res.status(200).json({message: "User already exists"});
    else
    {
      users.push({"username":username, "password":password});
      console.log(users);
      return res.status(200).json({message: "User " + username + " added."})
    }
  }
  else{
    return res.send('Missing username/password');
  }






  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //share the books object array with format.
  let bookList_PR = new Promise((resolve, reject)=>{
     (resolve(JSON.stringify(books, null, 4)));
  })
  bookList_PR.then( (msg) => { res.status(200).json({message:msg})})
  //return res.status(200).json({message:JSON.stringify(books, null, 4)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  let bookDetails_PR = new Promise((resolve, reject)=>{
    var msg;
    if(!books[isbn]){
      msg = "Book with ISBN " + isbn + " isn't in our book catalogue.";
    }
    else {
      msg = JSON.stringify(books[isbn]);
    }
    resolve(msg);
  });

  bookDetails_PR.then((msg)=>{
    res.status(200).json({message:msg});
  });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  let booksByAuthor_PR = new Promise((resolve, reject)=>{
    let authorBooks = bookList.filter( book => (book.author == author) )
    let msg; 
    if(authorBooks.length > 0){
      msg = JSON.stringify(authorBooks, null, 4);
    }
    else{
      msg = "There are no books by author " + author + ". Please note the author search is case sensitive so far";
    }
    resolve(msg);
  })
  booksByAuthor_PR.then((msg)=>{
    res.status(200).json({message:msg});
  })
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  let bookByTitle_PR = new Promise((resolve, reject)=>{
    let msg;
    let authorBooks = bookList.filter( book => (book.title == title) )
    if(authorBooks.length > 0){
      msg =  JSON.stringify(authorBooks, null, 4);
    }
    else {
      msg = "There are no books by title " + title + ". Please note the title search is case sensitive so far";
    }
    resolve(msg);
  });
  
  bookByTitle_PR.then((msg)=>{
    res.status(200).json({message:msg});
  });
    

  
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
  let isbn = req.params.isbn;
  
    if (books[isbn])
      res.status(200).json({message:books[isbn].reviews });
    else
      res.status(200).json({message: "Book with ISBN " + isbn + " isn't in our book catalogue."})
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
