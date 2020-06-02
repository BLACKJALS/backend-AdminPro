var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


var app = express();
var usuario = require('../models/usuario');

app.post('/', (req, resp) => {
    var body = req.body;

    usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return resp.status(400).json({
                Result: false,
                Message: `credenciales erroneas`
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return resp.status(400).json({
                Result: false,
                Message: `credenciales erroneas`
            });
        }

        usuarioBD.password = '';
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });


        resp.status(200).json({
            Result: true,
            Usuario: usuarioBD,
            Token: token,
            Message: 'Ingresó al login' + usuarioBD.id
        });
    });
});

module.exports = app;