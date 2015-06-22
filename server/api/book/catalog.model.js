'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CatalogSchema = new Schema({
    mysql_id:String,
    kuaidu_id:String,
    //name:String,
    catalog:[{catalog_i:Number,catalog_n:String}]
});

module.exports = mongoose.model('Catalog', CatalogSchema,'catalog');