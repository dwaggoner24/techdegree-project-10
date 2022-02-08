var express = require('express');
var router = express.Router();
const {Book} = require('../models');
const book = require('../models/book');

//handler function to wrap each route
function asyncHandler(cb){
  return async(req,res,next) => {
    try {
      await cb(req,res,next)
    } catch(error) {
      res.status(500).send(error);
      next(error);
    }
  }
}
/* GET home page. */
//Books Route
//home route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
  }));

//shows full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  if (books) {
    res.render('index', {books})
  } else {
    res.status(404).render('error');
  }
  }));

//shows create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new-book', {book: {}, title: 'New Book'});
  }));

//posts a new book to database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    const book = await Book.create(req.body);
    res.redirect('/') //redirects to the home route
  } catch (error) {
    if(error.name === "SequelizeValidationError") { //checking the error
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: 'New Book'})
    } else {
      throw error; //error caught in the asyncHandler's catch block
    }

  }
  
}));

//shows book details form
router.get('/books/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book, title: book.title});
    }));

//updates book info in database
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
      await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/');
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") { //checking the error
        book = await Book.build(req.body);
        res.render('update-book', {book, errors: error.errors, title: 'New Book'})
      } else {
        throw error; //error caught in the asyncHandler's catch block
      }
    }
    
}));

// //deletes book -- PERMANENT 
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
}));



 module.exports = router;
