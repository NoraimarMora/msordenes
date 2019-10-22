'use strict'

var Repartidor = require('../models/repartidor');

var controller = {

    saveRepartidor: function(request, response) {
        var parameters = request.body
        var repartidor = new Repartidor();

        repartidor._id = parameters.delivery_man_id;
        repartidor.first_name = parameters.first_name;
        repartidor.last_name = parameters.last_name;
        repartidor.profile_image = parameters.profile_image;

        repartidor.save((error, repartidorStored) => {
            if (error) {
                return response.status(500).send({
                    status: 500,
                    error
                });
            } 
            if (!repartidorStored) {
                return response.status(404).send({
                    status: 404,
                    message: 'No se ha podido guardar el documento'
                });
            }

            var delivery_man = {
                id: repartidorStored._id,
                profile_image: repartidorStored.profile_image,
                first_name: repartidorStored.first_name,
                last_name: repartidorStored.last_name
            }
            
            return response.status(200).send({
                status: 200,
                delivery_man: delivery_man
            });
        });
    },

    getRepartidor: function(request, response) {
        var repartidorId = request.params.id;

        if (repartidorId == null) {
            return response.status(404).send({
                status: 404, 
                message: 'Not found'
            });
        }

        Repartidor.findById(repartidorId).exec(function (error, repartidor) {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!repartidor) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var delivery_man = {
                id: repartidor._id,
                profile_image: repartidor.profile_image,
                first_name: repartidor.first_name,
                last_name: repartidor.last_name
            }

            return response.status(200).send({
                status: 200,
                delivery_man: delivery_man
            });
        });
    },

    getRepartidores: function (request, response) {
        Repartidor.find({}).exec((error, repartidores) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!repartidores) {
                return response.status(404).send({
                    status: 404, 
                });
            }

            var delivery_men = []

            repartidores.map((repartidor) => {
                delivery_men.push({
                    id: repartidor._id,
                    profile_image: repartidor.profile_image,
                    first_name: repartidor.first_name,
                    last_name: repartidor.last_name
                })
            })
            return response.status(200).send({
                status: 200, 
                delivery_men: delivery_men
            });
        });
    },

    updateRepartidor: function (request, response) {
        var repartidor = request.params.id;
        var update = {};
        var parameters = request.body

        update.first_name = parameters.first_name;
        update.last_name = parameters.last_name;
        update.profile_image = parameters.profile_image;

        Repartidor.findByIdAndUpdate(repartidor, update, {new: true}, (error, repartidorUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }

            if (!repartidorUpdated) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var delivery_man = {
                id: repartidorUpdated._id,
                profile_image: repartidorUpdated.profile_image,
                first_name: repartidorUpdated.first_name,
                last_name: repartidorUpdated.last_name
            }

            return response.status(200).send({
                status: 200, 
                delivery_man: delivery_man
            });
        });
    },

    deleteRepartidor: function (request, response) {
        var repartidorId = request.params.id;

        Repartidor.findByIdAndRemove(repartidorId, (error, repartidorRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!repartidorRemoved) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var delivery_man = {
                id: repartidorRemoved._id,
                profile_image: repartidorRemoved.profile_image,
                first_name: repartidorRemoved.first_name,
                last_name: repartidorRemoved.last_name
            }

            return response.status(200).send({
                status: 200, 
                delivery_man: delivery_man
            });
        });
    } 
};

module.exports = controller;