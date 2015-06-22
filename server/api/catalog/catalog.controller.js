'use strict';

var _ = require('lodash');
var Catalog = require('./catalog.model');
var OSS = require('aliyun-oss');
var option = {
  accessKeyId: '0ykNDM0uXCaqmnOe',
  accessKeySecret: 'CQ9K47h0fxmJEWbTRFCN8OYM1qA7P4'
  ,host:'oss-cn-beijing.aliyuncs.com'
  ,timeout:10000
};
var oss = OSS.createClient(option);
var fs = require('fs');

// Get list of catalogs
exports.index = function(req, res) {
  Catalog.find(function (err, catalogs) {
    if(err) { return handleError(res, err); }
    return res.json(200, catalogs);
  });
};

// Get a single catalog
exports.show = function(req, res) {
  Catalog.findById(req.params.id, function (err, catalog) {
    if(err) { return handleError(res, err); }
    if(!catalog) { return res.send(404); }
    return res.json(catalog);
  });
};

exports.capture = function(req, res) {
  var mixid = req.params.id;
  var catalog_id = mixid.split("-")[0]
  var catalog_i = parseInt(mixid.split("-")[1])
  var capture = {
                  "catalog_id":catalog_id,
                  "catalog_i":catalog_i,
                  "catalog_pre":catalog_i,
                  "catalog_next":catalog_i,
                  "book_id":"",
                  "content":[]
                }
  Catalog.findById(catalog_id, function (err, catalog) {
    if(err) { return handleError(res, err); }
    if(!catalog) { 
      return res.send(404); 
    }else{
      var key = catalog.kuaidu_id+'-'+catalog_i+'.txt';
      var pre_catalog_i = catalog_i;
      var next_catalog_i = catalog_i;
      _.forEach(catalog.catalog, function(value, key){
        if(value.catalog_i<catalog_i){
          if(catalog_i==pre_catalog_i){
            pre_catalog_i = value.catalog_i;
          }
          
          if(value.catalog_i>pre_catalog_i){
            pre_catalog_i = value.catalog_i;
          }
        }
        if(value.catalog_i>catalog_i){
          if(catalog_i==next_catalog_i){
            next_catalog_i = value.catalog_i;
          }
          
          if(value.catalog_i<next_catalog_i){
            next_catalog_i = value.catalog_i;
          }
        }
      });
      //console.log(key)
      oss.getObject({
      bucket: 'bookutf8',
      object: key
      }, function (err, res1) {
          if(err) {
            console.log(err) 
            return handleError(res, err); 
          }
          capture.catalog_pre = pre_catalog_i;
          capture.catalog_next = next_catalog_i;
          capture.book_id = catalog.book_id;
          _.forEach(res1.body.toString().split("\n"), function(value, key){
            var tmp = {"id":key,"text":value}
            capture.content.push(tmp)
          })
            
          // console.log(catalog.book_id)
          return res.json(capture);
      });
    }
    
  });
};

exports.capturePre = function(req, res) {
  var mixid = req.params.id;
  var catalog_id = mixid.split("-")[0]
  var catalog_i = parseInt(mixid.split("-")[1])
  var capture = {
                  "catalog_id":catalog_id,
                  "catalog_i":catalog_i,
                  "content":[]
                }
  Catalog.findById(catalog_id, function (err, catalog) {
    if(err) { return handleError(res, err); }
    if(!catalog) { 
      return res.send(404); 
    }else{
      var new_catalog_i = catalog_i;
      _.forEach(catalog.catalog, function(value, key){
        if(value.catalog_i<catalog_i){
          if(catalog_i==new_catalog_i){
            new_catalog_i = value.catalog_i;
          }
          
          if(value.catalog_i>new_catalog_i){
            new_catalog_i = value.catalog_i;
          }
        }
      });
      var key = catalog.kuaidu_id+'-'+new_catalog_i+'.txt';
      //console.log(key)
      oss.getObject({
      bucket: 'bookutf8',
      object: key
      }, function (err, res1) {
          if(err) { return handleError(res, err); }
          capture.catalog_i = new_catalog_i;
          capture.content = res1.body.toString().split("\n");
          console.log(capture.content)
          return res.json(capture);
      });
    }
    
  });
};

exports.captureNext = function(req, res) {
  var mixid = req.params.id;
  var catalog_id = mixid.split("-")[0]
  var catalog_i = parseInt(mixid.split("-")[1])
  var capture = {
                  "catalog_id":catalog_id,
                  "catalog_i":catalog_i,
                  "content":[]
                }
  Catalog.findById(catalog_id, function (err, catalog) {
    if(err) { return handleError(res, err); }
    if(!catalog) { 
      return res.send(404); 
    }else{
      
      var new_catalog_i = catalog_i;
      _.forEach(catalog.catalog, function(value, key){
        if(value.catalog_i>catalog_i){
          if(catalog_i==new_catalog_i){
            new_catalog_i = value.catalog_i;
          }
          
          if(value.catalog_i<new_catalog_i){
            new_catalog_i = value.catalog_i;
          }
        }
      });
      var key = catalog.kuaidu_id+'-'+new_catalog_i+'.txt';
      //console.log(key)
      oss.getObject({
      bucket: 'bookutf8',
      object: key
      }, function (err, res1) {
          if(err) { return handleError(res, err); }
          capture.catalog_i = new_catalog_i;
          capture.content = res1.body.toString().split("\n");
          console.log(capture.content)
          return res.json(capture);
      });
    }
    
  });
};

// Creates a new catalog in the DB.
exports.create = function(req, res) {
  Catalog.create(req.body, function(err, catalog) {
    if(err) { return handleError(res, err); }
    return res.json(201, catalog);
  });
};

// Updates an existing catalog in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Catalog.findById(req.params.id, function (err, catalog) {
    if (err) { return handleError(res, err); }
    if(!catalog) { return res.send(404); }
    var updated = _.merge(catalog, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, catalog);
    });
  });
};

// Deletes a catalog from the DB.
exports.destroy = function(req, res) {
  Catalog.findById(req.params.id, function (err, catalog) {
    if(err) { return handleError(res, err); }
    if(!catalog) { return res.send(404); }
    catalog.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}