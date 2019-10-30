'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var { initBroker } = require('./broker');
var callback = require('./broker/callbacks');
var { asyncForEach } = require('./utils');
var { BROKER_URL } = require('./config');

var app = express();
var broker = null;

// Cargar archivos de rutas
var ordenRoutes = require('./routes/orden');
var caracteristicaRoutes = require('./routes/caracteristica');
var clienteRoutes = require('./routes/cliente');
var direccionRoutes = require('./routes/direccion');
var elementoOrdenRoutes = require('./routes/elementoOrden');
var productoRoutes = require('./routes/producto');
var estadoRoutes = require('./routes/estado');
var repartidorRoutes = require('./routes/repartidor');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Rutas
app.get('/', function(req, res) {
  res.send('Microservicio de Ordenes');
});

app.use('/ordenes', ordenRoutes);
app.use('/caracteristicas', caracteristicaRoutes);
app.use('/clientes', clienteRoutes);
app.use('/direcciones', direccionRoutes);
app.use('/repartidores', repartidorRoutes);
app.use('/productos', productoRoutes);
app.use('/estados', estadoRoutes);
app.use('/elementos', elementoOrdenRoutes);

const jsonlog = (obj) => {
  if (typeof obj === 'object') {
    console.log(JSON.stringify(obj, '', 2));
  }
}

const subscriptions = [
  { queue: 'product-created', callback: callback.productCreated },
  { queue: 'product-updated', callback: callback.productUpdated },
  { queue: 'product-deleted', callback: callback.productDeleted },
  { queue: 'product-characteristic-created', callback: jsonlog },
  { queue: 'product-characteristic-updated', callback: jsonlog },
  { queue: 'product-characteristic-deleted', callback: jsonlog },
  { queue: 'client-created', callback: callback.clientCreated },
  { queue: 'client-updated', callback: callback.clientUpdated },
  { queue: 'client-deleted', callback: callback.clientDeleted },
  { queue: 'address-created', callback: callback.addressCreated },
  { queue: 'address-updated', callback: callback.addressUpdated },
  { queue: 'address-deleted', callback: callback.addressDeleted },
  { queue: 'courier-created', callback: callback.courierCreated },
  { queue: 'courier-updated', callback: callback.courierUpdated },
  { queue: 'courier-deleted', callback: callback.courierDeleted },
  { queue: 'process-cart', callback: callback.processCart },
];

const start = async () => {
  broker = await initBroker(BROKER_URL);

  await asyncForEach(subscriptions, async ({ queue, callback }) => {
    await broker.createChannel()
      .then((ch) => ch.assertQueue(queue)
        .then((_ok) => ch.consume(queue, async (msg) => {
          if (msg !== null) {
            const content = JSON.parse(msg.content.toString());

            callback(content);

            console.log(`[CONSUMER] Acknowledged ${msg.content.toString()}`);
          }
        }, { noAck: true }))
      ).catch(console.warn);
  });
}

start();

// Exportar
module.exports = app;
