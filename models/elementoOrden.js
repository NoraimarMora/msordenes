'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ElementoOrdenSchema = Schema({
    orden_id: {type: Schema.Types.ObjectId, ref: 'Orden', required: true},
    product: {type: Schema.Types.ObjectId, ref: 'Producto', required: true}, // ID en Ms Catalogo
    quantity: {type: Number, required: true},
    unit_price: {type: Number, required: true},
    features: [{type: Schema.Types.ObjectId, ref: 'Caracteristica'}]
});

module.exports = mongoose.model('ElementoOrden', ElementoOrdenSchema);