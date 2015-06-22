'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CaptureSchema = new Schema({
    catalog_i:Number,
    catalog_n:String,
    content:String,
});

module.exports = mongoose.model('Capture', CaptureSchema,'capture');