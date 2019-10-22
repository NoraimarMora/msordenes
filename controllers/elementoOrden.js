'use strict'

var ElementoOrden = require('../models/elementoOrden');

var controller = {

    saveElementoOrden: function(request, response) {
        var parameters = request.body
        var elementoOrden = new ElementoOrden();

        elementoOrden.order_id = parameters.order_id;
        elementoOrden.product = parameters.product;
        elementoOrden.quantity = parameters.quantity;
        elementoOrden.unit_price = parameters.unit_price;
        elementoOrden.features = parameters.features;

        elementoOrden.save((error, elementoOrdenStored) => {
            if (error) {
                return response.status(500).send({
                    status: 500,
                    error
                });
            } 
            if (!elementoOrdenStored) {
                return response.status(404).send({
                    status: 404,
                    message: 'No se ha podido guardar el documento'
                });
            }

            var order_item = {
                id: elementoOrdenStored._id,
                order_id: elementoOrdenStored.order_id,
                product: elementoOrdenStored.product,
                quantity: elementoOrdenStored.quantity,
                unit_price: elementoOrdenStored.unit_price,
                features: elementoOrdenStored.features
            }
            
            return response.status(200).send({
                status: 200,
                order_item: order_item
            });
        });
    },

    getElementoOrden: function(request, response) {
        var elementoOrdenId = request.params.id;

        if (elementoOrdenId == null) {
            return response.status(404).send({
                status: 404, 
                message: 'Not found'
            });
        }

        ElementoOrden.findById(elementoOrdenId).exec(function (error, elementoOrden) {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!elementoOrden) {
                return response.status(404).send({
                    status: 404, 
                });
            }

            var order_item = {
                id: elementoOrden._id,
                order_id: elementoOrden.order_id,
                product: elementoOrden.product,
                quantity: elementoOrden.quantity,
                unit_price: elementoOrden.unit_price,
                features: elementoOrden.features
            }

            return response.status(200).send({
                status: 200,
                order_item: order_item
            });
        });
    },

    getElementosOrden: function (request, response) {
        ElementoOrden.find({}).exec((error, elementosOrden) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!elementosOrden) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var order_items = []

            elementosOrden.map((elementoOrden) => {
                order_items.push({
                    id: elementoOrden._id,
                    order_id: elementoOrden.order_id,
                    product: elementoOrden.product,
                    quantity: elementoOrden.quantity,
                    unit_price: elementoOrden.unit_price,
                    features: elementoOrden.features
                })
            })

            return response.status(200).send({
                status: 200, 
                order_items: order_items
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
                    status: 500, 
                    error
                });
            }

            if (!elementoOrdenUpdated) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var order_item = {
                id: elementoOrdenUpdated._id,
                order_id: elementoOrdenUpdated.order_id,
                product: elementoOrdenUpdated.product,
                quantity: elementoOrdenUpdated.quantity,
                unit_price: elementoOrdenUpdated.unit_price,
                features: elementoOrdenUpdated.features
            }

            return response.status(200).send({
                status: 200, 
                order_item: order_item
            });
        });
    },

    deleteElementoOrden: function (request, response) {
        var elementoOrdenId = request.params.id;

        ElementoOrden.findByIdAndRemove(elementoOrdenId, (error, elementoOrdenRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!elementoOrdenRemoved) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var order_item = {
                id: elementoOrdenRemoved._id,
                order_id: elementoOrdenRemoved.order_id,
                product: elementoOrdenRemoved.product,
                quantity: elementoOrdenRemoved.quantity,
                unit_price: elementoOrdenRemoved.unit_price,
                features: elementoOrdenRemoved.features
            }

            return response.status(200).send({
                status: 200, 
                order_item: order_item
            });
        });
    } 
};

module.exports = controller;