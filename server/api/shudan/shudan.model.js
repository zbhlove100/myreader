'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShudanSchema = new Schema({
  name: String,
  type: String,
  description:String,
  emontion:[String],
  favoritenum:Number,
  viewnum:Number,
  shudanimages:[{"img_url":String,"description":String}],
  mainimage:String,
  books:[{ type: Schema.Types.ObjectId, ref: 'Book' }],
  active: Boolean
});

module.exports = mongoose.model('Shudan', ShudanSchema,'shudan');