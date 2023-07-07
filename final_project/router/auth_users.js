const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const jwtSecretKey = "4cc388_t0kkan";
let users = [{"username":"ilay","password":"pass"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return (users[username] > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter( function(user){
    return (user.username === username && user.password === password)
  });

  if(validusers.length == 1)
    return true;
  else 
    return false;



}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  
  if(!username || !password){
    return res.status(404).json({message: "Error logging in. Missing credentials"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data:password}, jwtSecretKey, {expiresIn: 60*60});
    req.session.authorization = {accessToken,username};
    return res.status(200).json("User successfully logged in");
  }else{
    return res.status(208).json("Invalid Login. Check username and password");
  }
  
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let new_review = req.query.review; 

  if(isbn && new_review){
    //check if a review with user exists. If exists, update the content, otherwise add a new one for the user.
    let username = req.session.authorization['username'];
    //check if there is a review by the user and update it
    if(books[isbn].reviews[username]){
      books[isbn].reviews[username] = new_review;
    }
    else//otherwise add a new review
    {
      Object.assign( (books[isbn].reviews), {[username]:new_review});
    }
    return res.status(200).json("The review for the book with ISBN " + isbn + " has been added/updated");
    
  }
  else{
    return res.status(200).json({message:"you need to provide an ISBN number and a review"})
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//delete user's review on the book by ISBN
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  
  if(books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    res.status(200).json("Review for the ISBN " + isbn + " posted by the user " + username + " is now deleted");
  }else{
    res.status(200).json("No reviews found for the user for the ISBN provided");
  }
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.jwtSK = jwtSecretKey;
