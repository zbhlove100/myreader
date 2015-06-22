'use strict';

var _ = require('lodash');
var Book = require('./book.model');
var Cate = require('./category.model')
var Catalog = require('../catalog/catalog.model')
var ObjectId = require('mongoose').Types.ObjectId; 
// Get list of books
exports.index = function(req, res) {
  var page = 1;
  var searchname = "";
  if(req.query.page){
    page = req.query.page;
  }
  if(req.query.searchname){
    searchname = req.query.searchname;
  }
  var pagesize = 5;
  var from = page*pagesize;
  var queryparams = {}
  
  var findbook = Book.find();
  if(searchname!=""){
    var searchreg = new RegExp(searchname, 'i')
    findbook.or([{ name: { $regex: searchreg }}, { author: { $regex: searchreg }}])
  }
  findbook.skip(from)
      .limit(pagesize)
      .exec(function (err, books) {
        if(err) { return handleError(res, err); }
        return res.json(200, books);
      });
};
exports.searchandcount = function(req, res) {
  var page = 0;
  var searchname = '';
  if(req.query.page){
    page = req.query.page;
  }
  if(req.query.searchname){
    searchname = req.query.searchname;
  }
  var pagesize = 5;
  var from = page*pagesize;

  var result = {"count":0,"books":[]}
  //console.log(searchname)
  var searchreg = new RegExp(searchname, 'i')
  Book.count().or([{ name: { $regex: searchreg }}, { author: { $regex: searchreg }}])
  .exec(function(err,count){
    if(err) { return handleError(res, err); }
    if(count == 0){
      return res.json(200, result);
    }else{
      result.count = count;
      Book.find()
      .or([{ name: { $regex: searchreg }}, { author: { $regex: searchreg }}])
      .skip(from)
      .limit(pagesize)
      .exec(function (err, books) {
        if(err) { return handleError(res, err); }
        result.books = books;
        return res.json(200, result);
      });
    }
    
  })
};

exports.mainpage = function(req,res){
  var pagesize = 9;
  Book.find()
      .where('featured').equals(true)
      .limit(pagesize)
      .exec(function(err,books){
        if(err){ 
          return handleError(res, err); 
        }else{
          if(books.length == 0){
            Book.find().limit(pagesize)
                .exec(function (err, books) {
                    if(err) { return handleError(res, err); }
                    return res.json(200, books);
                  })
          }else{
            return res.json(200, books);
          }
        }

      });
}
exports.catebooks =function(req,res){
  var page = 0;
  var searchname = "";
  var cate_code = "100";
  if(req.params.id){
    cate_code = req.params.id;
  }
  if(req.query.page){
    page = req.query.page;
  }
  if(req.query.searchname){
    searchname = req.query.searchname;
  }
  var pagesize = 5;
  var from = page*pagesize;
  
  var findbook = Book.find();
  if(searchname!=""){
    var searchreg = new RegExp(searchname, 'i')
    findbook.or([{ name: { $regex: searchreg }}, { author: { $regex: searchreg }}])
  }

  findbook.where("cate_code",cate_code)
      .skip(from)
      .limit(pagesize)
      .exec(function (err, books) {
        if(err) { return handleError(res, err); }
        return res.json(200, books);
      });
}

exports.catalog = function(req, res) {
  var book_id = req.params.bookid;
  console.log(book_id)
  Catalog.findOne({"book_id":new ObjectId(book_id)})
          .exec(function (err, book) {
                  if(err) { return handleError(res, err); }
                  if(!book){ 
                    return res.send(404); 
                  }else{
                    return res.json(book);
                    }
                  
                });
};
// Get a single book
exports.show = function(req, res) {
  Book.findById(req.params.id, function (err, book) {
    if(err) { return handleError(res, err); }
    if(!book) { return res.send(404); }
    return res.json(book);
  });
};

// Creates a new book in the DB.
exports.create = function(req, res) {
  Book.create(req.body, function(err, book) {
    if(err) { return handleError(res, err); }
    return res.json(201, book);
  });
};

// Updates an existing book in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Book.findById(req.params.id, function (err, book) {
    if (err) { return handleError(res, err); }
    if(!book) { return res.send(404); }
    var updated = _.merge(book, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, book);
    });
  });
};

// Deletes a book from the DB.
exports.destroy = function(req, res) {
  Book.findById(req.params.id, function (err, book) {
    if(err) { return handleError(res, err); }
    if(!book) { return res.send(404); }
    book.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}