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
            // orden.store_id = parameters.store_id;
            orden.delivery_man_id = parameters.delivery_man_id;
            orden.payment_method = parameters.payment_method;
            orden.address = parameters.address;
            orden.phone = parameters.phone;
            orden.products = [];
            orden.status = parameters.status;
            orden.total = 0;

            parameters.products.map((product) => {
                var element = new ElementoOrden();
                element.order_id = orden._id,
                element.product = product.id,
                element.quantity = product.quantity,
                element.unit_price = product.unit_price,
                element.features = []

                element.save((error, elementStored) => {
                    if (error) {
                        return response.status(500).send({
                            status: 500,
                            error
                        });
                    } 
                    if (!elementStored) {
                        return response.status(404).send({
                            status: 404,
                            message: 'Not found'
                        });
                    } 
                });
                
                orden.total = orden.total + (element.unit_price * element.quantity);
                orden.products.push(element._id);
            });

            orden.save((error, ordenStored) => {
                if (error) {
                    return response.status(500).send({
                        status: 500,
                        error
                    });
                } 
                if (!ordenStored) {
                    return response.status(404).send({
                        status: 404,
                        message: 'No se ha podido guardar el documento'
                    });
                }

                var order = {
                    id: ordenStored._id,
                    client: ordenStored.client_id,
                    address: ordenStored.address,
                    phone: ordenStored.phone,
                    delivery_man: ordenStored.delivery_man_id,
                    products: ordenStored.products,
                    payment_method: ordenStored.payment_method,
                    total: ordenStored.total,
                    status: ordenStored.status,
                    date_created: ordenStored.date_created
                }

                /*var ordenNotifyObj = {
                    orderId: ordenStored._id,
                    storeId: ordenStored.store_id,
                    assignedCourierName: faker.name.findName(),
                    products: [
                        { name: 'Hamburguesa de queso', qty: faker.random.number(), img: 'https://img1.mashed.com/img/gallery/fast-food-hamburgers-ranked-worst-to-best/intro-1540401194.jpg' },
                        { name: 'Refresco', qty: faker.random.number(), img: 'https://secure.ce-tescoassets.com/assets/CZ/202/8594008040202/ShotType1_540x540.jpg' }
                    ]
                }*/

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

                // notifyOrderCreated('task1', ordenNotifyObj);

                return response.status(200).send({
                    status: 200,
                    order: order
                });
            });
        } catch (error) {
            return response.status(500).send({
                status: 500,
                error
            });
        }
    },

    getOrden: function(request, response) {
        var ordenId = request.params.id;

        if (ordenId == null) {
            return response.status(404).send({
                status: 404, 
                message: 'Not found'
            });
        }

        Orden.findById(ordenId)
            .populate('client_id')
            .populate('address')
            .populate('delivery_man_id')
            .populate({
                path: 'products',
                populate: {
                    path: 'product'
                }
            })
            .populate('status')
            .exec(function (error, orden) {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!orden) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var products = []

            orden.products.map((producto) => {
                products.push({
                    id: producto._id,
                    order_id: producto.order_id,
                    name: producto.product.name,
                    image_url: producto.product.image_url,
                    quantity: producto.quantity,
                    unit_price: producto.unit_price,
                    features: producto.features
                })
            })

            var order = {
                id: orden._id,
                client: {
                    id: orden.client_id._id,
                    first_name: orden.client_id.first_name,
                    last_name: orden.client_id.last_name,
                    addresses: orden.client_id.addresses
                },
                address: {
                    id: orden.address._id,
                    client_id: orden.address.client_id,
                    latitude: orden.address.latitude,
                    longitude: orden.address.longitude             
                },
                phone: orden.phone,
                delivery_man: {
                    id: orden.delivery_man_id._id,
                    first_name: orden.delivery_man_id.first_name,
                    last_name: orden.delivery_man_id.last_name,
                    profile_image: orden.delivery_man_id.profile_image
                },
                products: products,
                payment_method: orden.payment_method,
                total: orden.total,
                status: {
                    id: orden.status._id,
                    name: orden.status.name,
                    color: orden.status.color
                },
                date_created: orden.date_created
            }

            return response.status(200).send({
                status: 200,
                order: order
            });
        });
    },

    getOrdenByCliente: function(request, response) {
        var clienteId = request.params.id;

        if (clienteId == null) {
            return response.status(404).send({
                status: 404, 
                message: 'Not found'
            });
        }

        Orden.find({client_id: clienteId})
            .populate('client_id')
            .populate('address')
            .populate('delivery_man_id')
            .populate({
                path: 'products',
                populate: {
                    path: 'product'
                }
            })
            .populate('status')
            .exec(function (error, orden) {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!orden) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var products = []

            orden.products.map((producto) => {
                products.push({
                    id: producto._id,
                    order_id: producto.order_id,
                    name: producto.product.name,
                    image_url: producto.product.image_url,
                    quantity: producto.quantity,
                    unit_price: producto.unit_price,
                    features: producto.features
                })
            })

            var order = {
                id: orden._id,
                client: {
                    id: orden.client_id._id,
                    first_name: orden.client_id.first_name,
                    last_name: orden.client_id.last_name,
                    addresses: orden.client_id.addresses
                },
                address: {
                    id: orden.address._id,
                    client_id: orden.address.client_id,
                    latitude: orden.address.latitude,
                    longitude: orden.address.longitude             
                },
                phone: orden.phone,
                delivery_man: {
                    id: orden.delivery_man_id._id,
                    first_name: orden.delivery_man_id.first_name,
                    last_name: orden.delivery_man_id.last_name,
                    profile_image: orden.delivery_man_id.profile_image
                },
                products: products,
                payment_method: orden.payment_method,
                total: orden.total,
                status: {
                    id: orden.status._id,
                    name: orden.status.name,
                    color: orden.status.color
                },
                date_created: orden.date_created
            }

            return response.status(200).send({
                status: 200,
                order: order
            });
        });
    },

    getOrdenes: function (request, response) {
        Orden.find({})
            .populate('client_id')
            .populate('address')
            .populate('delivery_man_id')
            .populate({
                path: 'products',
                populate: {
                    path: 'product'
                }
            })
            .populate('status').exec((error, ordenes) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!ordenes) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var orders = []

            ordenes.map((orden) => {
                var products = []

                orden.products.map((producto) => {
                    products.push({
                        id: producto._id,
                        order_id: producto.order_id,
                        name: producto.product.name,
                        image_url: producto.product.image_url,
                        quantity: producto.quantity,
                        unit_price: producto.unit_price,
                        features: producto.features
                    })
                })
    
                orders.push({
                    id: orden._id,
                    client: {
                        id: orden.client_id._id,
                        first_name: orden.client_id.first_name,
                        last_name: orden.client_id.last_name,
                        addresses: orden.client_id.addresses
                    },
                    address: {
                        id: orden.address._id,
                        client_id: orden.address.client_id,
                        latitude: orden.address.latitude,
                        longitude: orden.address.longitude             
                    },
                    phone: orden.phone,
                    delivery_man: {
                        id: orden.delivery_man_id._id,
                        first_name: orden.delivery_man_id.first_name,
                        last_name: orden.delivery_man_id.last_name,
                        profile_image: orden.delivery_man_id.profile_image
                    },
                    products: products,
                    payment_method: orden.payment_method,
                    total: orden.total,
                    status: {
                        id: orden.status._id,
                        name: orden.status.name,
                        color: orden.status.color
                    },
                    date_created: orden.date_created
                })
            })

            return response.status(200).send({
                status: 200, 
                orders: orders
            });
        });
    },

    assignDeliveryMan: function (request, response) {
        var ordenId = request.params.id;
        var update = {};
        var parameters = request.body

        update.delivery_man_id = parameters.delivery_man_id;

        Orden.findByIdAndUpdate(ordenId, update, {new: true}, (error, ordenUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }

            if (!ordenUpdated) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var order = {
                id: ordenUpdated._id,
                client: ordenUpdated.client_id,
                address: ordenUpdated.address,
                phone: ordenUpdated.phone,
                delivery_man: ordenUpdated.delivery_man_id,
                products: ordenUpdated.products,
                payment_method: ordenUpdated.payment_method,
                total: ordenUpdated.total,
                status: ordenUpdated.status,
                date_created: ordenUpdated.date_created
            }

            return response.status(200).send({
                status: 200, 
                order: order
            });
        });
    },

    updateOrderStatus: function (request, response) {
        var ordenId = request.params.id;
        var update = {};
        var parameters = request.body

        update.status = parameters.status;

        Orden.findByIdAndUpdate(ordenId, update, {new: true}, (error, ordenUpdated) => {

            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }

            if (!ordenUpdated) {
                return response.status(404).send({
                    status: 404, 
                    message: 'Not found'
                });
            }

            var order = {
                id: ordenUpdated._id,
                client: ordenUpdated.client_id,
                address: ordenUpdated.address,
                phone: ordenUpdated.phone,
                delivery_man: ordenUpdated.delivery_man_id,
                products: ordenUpdated.products,
                payment_method: ordenUpdated.payment_method,
                total: ordenUpdated.total,
                status: ordenUpdated.status,
                date_created: ordenUpdated.date_created
            }

            return response.status(200).send({
                status: 200, 
                order: order
            });
        });
    },

    deleteOrden: function (request, response) {
        var ordenId = request.params.id;

        ElementoOrden.deleteMany({orden_id: ordenId}, (error, elements) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
        });

        Orden.findByIdAndRemove(ordenId, (error, ordenRemoved) => {
            if (error) {
                return response.status(500).send({
                    status: 500, 
                    error
                });
            }
            if (!ordenRemoved) {
                return response.status(404).send({
                    status: 404, 
                });
            }

            var order = {
                id: ordenRemoved._id,
                client: ordenRemoved.client_id,
                address: ordenRemoved.address,
                phone: ordenRemoved.phone,
                delivery_man: ordenRemoved.delivery_man_id,
                products: ordenRemoved.products,
                payment_method: ordenRemoved.payment_method,
                total: ordenRemoved.total,
                status: ordenRemoved.status,
                date_created: ordenRemoved.date_created
            }

            return response.status(200).send({
                status: 200, 
                order: order
            });
        });
    } 
};

module.exports = controller;