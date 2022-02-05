var express = require('express');
var router = express.Router();
const { Book } = require('../models');

//asyncHandler
function asyncHandler(cb){
  return async(req,res,next) => {
    try {
      await cb(req,res,next)
    } catch(error) {
      next(error);
    }
  }
}
/* GET home page. */
//Books Route
//home route

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
  }));




module.exports = router;
