'use strict';

var _ = require('lodash');
var Cate = require('./cate.model');

// Get list of cates
exports.index = function(req, res) {
  var pagesize = 3;
  Cate.find()
      .sort('display_order')
      .exec(function(err,books){
        if(err){ 
          return handleError(res, err); 
        }else{
          
          return res.json(200, books);

        }

      });
};

// Get a single cate
exports.show = function(req, res) {
  Cate.findById(req.params.id, function (err, cate) {
    if(err) { return handleError(res, err); }
    if(!cate) { return res.send(404); }
    return res.json(cate);
  });
};

// Creates a new cate in the DB.
exports.create = function(req, res) {
  Cate.create(req.body, function(err, cate) {
    if(err) { return handleError(res, err); }
    return res.json(201, cate);
  });
};

// Updates an existing cate in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cate.findById(req.params.id, function (err, cate) {
    if (err) { return handleError(res, err); }
    if(!cate) { return res.send(404); }
    var updated = _.merge(cate, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cate);
    });
  });
};

// Deletes a cate from the DB.
exports.destroy = function(req, res) {
  Cate.findById(req.params.id, function (err, cate) {
    if(err) { return handleError(res, err); }
    if(!cate) { return res.send(404); }
    cate.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}