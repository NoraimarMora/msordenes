'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrdenSchema = Schema({
    client_id: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true},
    store_id: {type: String, required: true},
    address: {type: Schema.Types.ObjectId, ref: 'Direccion'},
    phone: {type: String, default: ''},
    delvery_man_id: {type: Schema.Types.ObjectId, ref: 'Repartidor', required: true},
    products: [{type: Schema.Types.ObjectId, ref: 'ElementoOrden'}],   
    payment_method: {type: String, required: true},
    total: {type: Number, required: true},
    // status: {type: Schema.Types.ObjectId, ref: 'Estado', required: true},
    status: {type: String, required: true},
    date_created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Orden', OrdenSchema);