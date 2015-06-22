'use strict';

var _ = require('lodash');
var Shudan = require('./shudan.model');
var mongoose = require('mongoose')

// Get list of shudans
exports.index = function(req, res) {
  var page = 0;
  var searchname = "";
  if(req.query.page){
    page = req.query.page;
  }
  if(req.query.searchname){
    searchname = req.query.searchname;
  }
  var pagesize = 5;
  var from = page*pagesize;

  Shudan.find({"name":new RegExp(searchname, 'i')})
  .skip(from)
  .limit(pagesize)
  .exec(function (err, shudans) {
    if(err) { return handleError(res, err); }

    return res.json(200, shudans);
  });
    
    
 
  
};

exports.searchandcount = function(req, res) {
  var page = 0;
  var searchname = "";
  if(req.query.page){
    page = req.query.page;
  }
  if(req.query.searchname){
    searchname = req.query.searchname;
  }
  var pagesize = 20;
  var from = page*pagesize;
  var result = {"count":0,"shudans":[]}
  Shudan.count({"name":new RegExp(searchname, 'i')},function(err,count){
    if(err) { return handleError(res, err); }
    if(count == 0){
      return res.json(200, result);
    }else{
      result.count = count;
      Shudan.find({"name":new RegExp(searchname, 'i')})
      .skip(from)
      .limit(pagesize)
      .exec(function (err, shudans) {
        if(err) { return handleError(res, err); }
        result.shudans = shudans;
        return res.json(200, result);
      });
    }
    
  })
  
};

// Get a single shudan
exports.show = function(req, res) {
  Shudan.findById(req.params.id)
        .populate('books')
        .exec(function (err, shudan) {
              if(err) { return handleError(res, err); }
              if(!shudan) { return res.send(404); }
              return res.json(shudan);
            });
};

// Creates a new shudan in the DB.
exports.create = function(req, res) {

  Shudan.create(req.body, function(err, shudan) {
    if(err) { return handleError(res, err); }
    return res.json(201, shudan);
  });
};

// Updates an existing shudan in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Shudan.findById(req.params.id, function (err, shudan) {
    if (err) { return handleError(res, err); }
    if(!shudan) { return res.send(404); }
    var updated = _.assign(shudan, 
                          _.pick(req.body,function(value,key,o){
                              return key != "__v";
                            })
                          );
    
    // updated.books = [];
    // updated.books = req.body.books;
    console.log(updated)
    updated.save(function (err) {
      if (err) { 

        return handleError(res, err); }
      
      return res.json(200, shudan);
    });
  });
};

// Deletes a shudan from the DB.
exports.destroy = function(req, res) {
  Shudan.findById(req.params.id, function (err, shudan) {
    if(err) { return handleError(res, err); }
    if(!shudan) { return res.send(404); }
    shudan.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}