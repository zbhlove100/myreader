'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookSchema = new Schema({
    mysql_id:String,
    kuaidu_id:String,
    name:String,
    author:String,
    cate:String,
    cate_code:String,
    status:Number,
    kuaidu_img:Number,
    description:String,
    catalog_t:String,
    chapter_c:String,
    chapter_i:String,
    chapter_n:String,
    word:Number,
    //customer
    favorite:Number,
    featured:Boolean
});

module.exports = mongoose.model('Book', BookSchema,'book');