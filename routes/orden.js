'use strict'

var express = require('express');
var router = express.Router();
var OrdenController = require('../controllers/orden');

router.post('/', OrdenController.saveOrden);
router.get('/:id', OrdenController.getOrden);
router.get('/', OrdenController.getOrdenes);
router.put('/delivery/:id', OrdenController.assignDeliveryMan);
router.put('/update/:id', OrdenController.updateOrderStatus);
router.delete('/delete/:id', OrdenController.deleteOrden);

module.exports = router;