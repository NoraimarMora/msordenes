'use strict'

var mongoose = require('mongoose');
var MicroserviceId = require('../customSchemaType/MicroserviceId')
var Schema = mongoose.Schema;

var ElementoOrdenSchema = Schema({
    order_id: {type: Schema.Types.ObjectId, ref: 'Orden', required: true},
    product: {type: Schema.Types.MicroserviceId, ref: 'Producto', required: true}, // ID en Ms Catalogo
    quantity: {type: Number, required: true},
    unit_price: {type: Number, required: true},
    features: [{type: Schema.Types.MicroserviceId, ref: 'Caracteristica'}]  // IDs en Ms Catalogo
});

module.exports = mongoose.model('ElementoOrden', ElementoOrdenSchema);