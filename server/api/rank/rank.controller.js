'use strict';

var _ = require('lodash');
var Rank = require('./rank.model');

// Get list of ranks
exports.index = function(req, res) {
  Rank.find(function (err, ranks) {
    if(err) { return handleError(res, err); }
    return res.json(200, ranks);
  });
};

// Get a single rank
exports.show = function(req, res) {
  Rank.findById(req.params.id, function (err, rank) {
    if(err) { return handleError(res, err); }
    if(!rank) { return res.send(404); }
    return res.json(rank);
  });
};

// Creates a new rank in the DB.
exports.create = function(req, res) {
  Rank.create(req.body, function(err, rank) {
    if(err) { return handleError(res, err); }
    return res.json(201, rank);
  });
};

// Updates an existing rank in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Rank.findById(req.params.id, function (err, rank) {
    if (err) { return handleError(res, err); }
    if(!rank) { return res.send(404); }
    var updated = _.merge(rank, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, rank);
    });
  });
};

// Deletes a rank from the DB.
exports.destroy = function(req, res) {
  Rank.findById(req.params.id, function (err, rank) {
    if(err) { return handleError(res, err); }
    if(!rank) { return res.send(404); }
    rank.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}