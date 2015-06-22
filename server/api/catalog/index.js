'use strict';

var express = require('express');
var controller = require('./catalog.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/capture/:id', controller.capture);
router.get('/capturePre/:id', controller.capturePre);
router.get('/captureNext/:id', controller.captureNext);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;