'use strict';

var express = require('express');
var controller = require('./book.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/searchandcount/', controller.searchandcount);
router.get('/mainpage', controller.mainpage);
router.get('/cate/:id', controller.catebooks);
router.get('/catalog/:bookid', controller.catalog);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;