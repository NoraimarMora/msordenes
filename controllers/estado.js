'use strict'

var Estado = require('../models/estado');

var controller = {

    saveEstado: function(request, response) {
        var parameters = request.body
        var estado = new Estado();

        estado.name = parameters.name;
        estado.color = parameters.color;
        
        estado.save((error, estadoStored) => {
            if (error) {
                return response.status(500).send({
                    status: 500,
                    error
                });
            } 
            if (!estadoStored) {
                return response.status(404).send({
                    status: 404,
                    message: 'No se ha podido guardar el documento'
                });
            }

            var status = {
                id: estadoStored._id,
                name: estadoStored.name,
                color: estadoStored.color
            }
            
            return response.status(200).send({
                status: 200,
                order_status: status
            });
        });
    },

    getEstado: function(request, response) {
        var estadoId = request.params.id;

        if (estadoId == null) {
            return response.status(404).send({
                status: 404, 
                message: 'Not found'
            });
        }

        Estado.findById(estadoId).exec(function (error, estado) {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!estado) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var status = {
                id: estado._id,
                name: estado.name,
                color: estado.color
            }

            return response.status(200).send({
                status: 200,
                order_status: status
            });
        });
    },

    getEstados: function (request, response) {
        Estado.find({}).exec((error, estados) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!estados) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var statuses = []

            estados.map((estado) => {
                statuses.push({
                    id: estado._id,
                    name: estado.name,
                    color: estado.color
                })
            })

            return response.status(200).send({
                status: 200, 
                order_statuses: statuses
            });
        });
    },

    updateEstado: function (request, response) {
        var estadoId = request.params.id;
        var update = {};
        var parameters = request.body

        update.name = parameters.name;
        update.color = parameters.color;

        Estado.findByIdAndUpdate(estadoId, update, {new: true}, (error, estadoUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }

            if (!estadoUpdated) {
                return response.status(404).send({
                    status: 404, 
                });
            }

            var status = {
                id: estadoUpdated._id,
                name: estadoUpdated.name,
                color: estadoUpdated.color
            }

            return response.status(200).send({
                status: 200, 
                order_status: status
            });
        });
    },

    deleteEstado: function (request, response) {
        var estadoId = request.params.id;

        Estado.findByIdAndRemove(estadoId, (error, estadoRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!estadoRemoved) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var status = {
                id: estadoRemoved._id,
                name: estadoRemoved.name,
                color: estadoRemoved.color
            }

            return response.status(200).send({
                status: 200, 
                order_status: status
            });
        });
    } 
};

module.exports = controller;