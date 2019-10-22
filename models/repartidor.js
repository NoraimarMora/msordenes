'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepartidorSchema = Schema({
    delivery_man_id: {type: String, required: true},  // ID en Ms Usuarios
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    profile_image: {type: String, allowed: null}
});

module.exports = mongoose.model('Repartidor', RepartidorSchema);