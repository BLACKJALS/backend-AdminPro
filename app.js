// Requires -> librerías necesarias para que funcione algo
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicialización de variables
var app = express();

// body parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Conexión bd
mongoose.connection.openUri('mongodb://localhost:27017/Hospital', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// rutas
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        Result: true,
        Message: 'Petición realizada correctamente'
    });
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});