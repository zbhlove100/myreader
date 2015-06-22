'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    mysql_id:String,
    cate_code:String,
    description:String,
    name:String,
    display_order:Number
});

module.exports = mongoose.model('Category', CategorySchema,'category');