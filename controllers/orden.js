'use strict'

var Orden = require('../models/orden');
var ElementoOrden = require('../models/elementoOrden');
var mongoose = require('mongoose');
const { notifyOrderCreated } = require('../broker');
const faker = require('faker');

var controller = {

    saveOrden: function(request, response) {
        var parameters = request.body
        var orden = new Orden();

        try {
            orden._id = new mongoose.Types.ObjectId()
            orden.client_id = parameters.client_id;
            orden.store_id = parameters.store_id;
            orden.delivery_man_id = parameters.delivery_man_id;
            orden.payment_method = parameters.payment_method;
            orden.address = parameters.address;
            orden.phone = parameters.phone;
            orden.products = [];
            orden.status = parameters.status;
            orden.total = 0;

            parameters.products.map((product) => {
                var element = new ElementoOrden();
                element.cart_id = carrito._id,
                element.product = product.id,
                element.quantity = product.quantity,
                element.unit_price = product.unit_price,
                element.features = []

                element.save((error, elementStored) => {
                    if (error) {
                        return response.status(500).send({error});
                    } 
                    if (!elementStored) {
                        return response.status(404).send({message: 'Not found'});
                    } 

                    orden.total = orden.total + (elementStored.unit_price * elementStored.quantity);
                    orden.products.push(elementStored._id);
                });
            });

            orden.save((error, ordenStored) => {
                if (error) {
                    return response.status(500).send({error});
                } 
                if (!ordenStored) {
                    return response.status(404).send({message: 'No se ha podido guardar el documento'});
                }

                var ordenNotifyObj = {
                    orderId: ordenStored._id,
                    storeId: ordenStored.store_id,
                    assignedCourierName: faker.name.findName(),
                    products: [
                        { name: 'Hamburguesa de queso', qty: faker.random.number(), img: 'https://img1.mashed.com/img/gallery/fast-food-hamburgers-ranked-worst-to-best/intro-1540401194.jpg' },
                        { name: 'Refresco', qty: faker.random.number(), img: 'https://secure.ce-tescoassets.com/assets/CZ/202/8594008040202/ShotType1_540x540.jpg' }
                    ]
                }

                /*
                  TODO: adapt `ordenNotifyObj` structure to be:

                  ```
                    orderId,
                    storeId: '1234',
                    assignedCourierName: faker.name.findName(),
                    products: [
                      { name: 'Hamburguesa de queso', qty: faker.random.number(), img: 'https://img1.mashed.com/img/gallery/fast-food-hamburgers-ranked-worst-to-best/intro-1540401194.jpg' },
                      { name: 'Refresco', qty: faker.random.number(), img: 'https://secure.ce-tescoassets.com/assets/CZ/202/8594008040202/ShotType1_540x540.jpg' },
                    ]
                  ```
                */

                // const ordenNotifyObj = {};
                notifyOrderCreated('task1', ordenNotifyObj);

                return response.status(200).send({orden: ordenStored});
            });
        } catch (error) {
            return response.status(500).send({error});
        }
    },

    getOrden: function(request, response) {
        var ordenId = request.params.id;

        if (ordenId == null) {
            return response.status(404).send({
                status: false, 
                message: 'Not found'
            });
        }

        Orden.findById(ordenId).exec(function (error, orden) {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!orden) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true,
                orden: orden
            });
        });
    },

    getOrdenes: function (request, response) {
        Orden.find({}).exec((error, ordenes) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!ordenes) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status:true, 
                ordenes: ordenes
            });
        });
    },

    updateCarrito: function (request, response) {
        var ordenId = request.params.id;
        var update = {};
        var parameters = request.body
        var total = 0;

        update.status = parameters.status;

        Orden.findByIdAndUpdate(ordenId, update, {new: true}, (error, ordenUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }

            if (!ordenUpdated) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                orden: ordenUpdated
            });
        });
    },

    deleteOrden: function (request, response) {
        var ordenId = request.params.id;

        ElementoOrden.deleteMany({orden_id: ordenId}, (error, elements) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
        });

        Orden.findByIdAndRemove(ordenId, (error, ordenRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: false, 
                    error
                });
            }
            if (!ordenRemoved) {
                return response.status(404).send({
                    status: false, 
                });
            }

            return response.status(200).send({
                status: true, 
                orden: ordenRemoved
            });
        });
    } 
};

module.exports = controller;