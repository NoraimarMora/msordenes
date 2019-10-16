'use strict'

var ElementoOrden = require('../models/elementoOrden');

var controller = {

    saveElementoOrden: function(request, response) {
        var parameters = request.body
        var elementoOrden = new ElementoOrden();

        elementoOrden.cart_id = parameters.cart_id;
        elementoOrden.product = parameters.product;
        elementoOrden.quantity = parameters.quantity;
        elementoOrden.unit_price = parameters.unit_price;
        elementoOrden.features = parameters.features;

        elementoOrden.save((error, elementoOrdenStored) => {
            if (error) {
                return response.status(500).send({error});
            } 
            if (!elementoOrdenStored) {
                return response.status(404).send({message: 'No se ha podido guardar el documento'});
            }

            
            return response.status(200).send({elementoOrden: elementoOrdenStored});
        });
    },

    getElementoOrden: function(request, response) {
        var elementoOrdenId = request.params.id;

        if (elementoOrdenId == null) {
            return response.status(404).send({
                status: false, 
            });
        }

        ElementoOrden.findById(elementoOrdenId).exec(function (error, elementoOrden) {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!elementoOrden) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true,
                elementoOrden: elementoOrden
            });
        });
    },

    getElementosOrden: function (request, response) {
        ElementoOrden.find({}).exec((error, elementosOrden) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!elementosOrden) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status:true, 
                elementosOrden: elementosOrden
            });
        });
    },

    updateElementoOrden: function (request, response) {
        var elementoOrdenId = request.params.id;
        var update = {};
        var parameters = request.body

        update.quantity = parameters.quantity;
        update.unit_price = parameters.unit_price;
        update.features = parameters.features;

        ElementoOrden.findByIdAndUpdate(elementoOrdenId, update, {new: true}, (error, elementoOrdenUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }

            if (!elementoOrdenUpdated) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                elementoOrden: elementoOrdenUpdated
            });
        });
    },

    deleteElementoOrden: function (request, response) {
        var elementoOrdenId = request.params.id;

        ElementoOrden.findByIdAndRemove(elementoOrdenId, (error, elementoOrdenRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!elementoOrdenRemoved) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                elementoOrden: elementoOrdenRemoved
            });
        });
    } 
};

module.exports = controller;