'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

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


// Exportar
module.exports = app;
