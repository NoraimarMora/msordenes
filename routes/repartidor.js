'use strict'

var express = require('express');
var router = express.Router();
var RepartidorController = require('../controllers/repartidor');

router.post('/', RepartidorController.saveRepartidor);
router.get('/:id', RepartidorController.getRepartidor);
router.get('/', RepartidorController.getRepartidors);
router.put('/update/:id', RepartidorController.updateRepartidor);
router.delete('/delete/:id', RepartidorController.deleteRepartidor);

module.exports = router;