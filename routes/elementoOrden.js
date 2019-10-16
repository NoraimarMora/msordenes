'use strict'

var express = require('express');
var router = express.Router();
var ElementoOrdenController = require('../controllers/elementoOrden');

router.post('/', ElementoOrdenController.saveElementoOrden);
router.get('/:id', ElementoOrdenController.getElementoOrden);
router.get('/', ElementoOrdenController.getElementosOrden);
router.put('/update/:id', ElementoOrdenController.updateElementoOrden);
router.delete('/delete/:id', ElementoOrdenController.deleteElementoOrden);

module.exports = router;