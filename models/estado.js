'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadoSchema = Schema({
    name: {type: String, required: true},
    color: {type: String, default: '#0079BF'}
});

module.exports = mongoose.model('Estado', EstadoSchema);