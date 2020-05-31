// Requires -> librerías necesarias para que funcione algo
var express = require('express');
var mongoose = require('mongoose');

// Inicialización de variables
var app = express();

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

// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});