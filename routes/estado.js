'use strict'

var express = require('express');
var router = express.Router();
var EstadoController = require('../controllers/estado');

router.post('/', EstadoController.saveEstado);
router.get('/:id', EstadoController.getEstado);
router.get('/', EstadoController.getEstados);
router.put('/update/:id', EstadoController.updateEstado);
router.delete('/delete/:id', EstadoController.deleteEstado);

module.exports = router;