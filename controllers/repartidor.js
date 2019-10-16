'use strict'

var Repartidor = require('../models/repartidor');

var controller = {

    saveRepartidor: function(request, response) {
        var parameters = request.body
        var repartidor = new Repartidor();

        repartidor.delivery_man_id = parameters.delivery_man_id;
        repartidor.first_name = parameters.first_name;
        repartidor.last_name = parameters.last_name;

        repartidor.save((error, repartidorStored) => {
            if (error) {
                return response.status(500).send({error});
            } 
            if (!repartidorStored) {
                return response.status(404).send({message: 'No se ha podido guardar el documento'});
            }

            
            return response.status(200).send({repartidor: repartidorStored});
        });
    },

    getRepartidor: function(request, response) {
        var repartidorId = request.params.id;

        if (repartidorId == null) {
            return response.status(404).send({
                status: false, 
            });
        }

        Repartidor.findById(repartidorId).exec(function (error, repartidor) {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!repartidor) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true,
                repartidor: repartidor
            });
        });
    },

    getRepartidores: function (request, response) {
        Repartidor.find({}).exec((error, repartidores) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!repartidores) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status:true, 
                repartidores: repartidores
            });
        });
    },

    updateRepartidor: function (request, response) {
        var repartidor = request.params.id;
        var update = {};
        var parameters = request.body

        update.first_name = parameters.first_name;
        update.last_name = parameters.last_name;

        Repartidor.findByIdAndUpdate(repartidor, update, {new: true}, (error, repartidorUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }

            if (!repartidorUpdated) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                repartidor: repartidorUpdated
            });
        });
    },

    deleteRepartidor: function (request, response) {
        var repartidorId = request.params.id;

        Repartidor.findByIdAndRemove(repartidorId, (error, repartidorRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!repartidorRemoved) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                repartidor: repartidorRemoved
            });
        });
    } 
};

module.exports = controller;