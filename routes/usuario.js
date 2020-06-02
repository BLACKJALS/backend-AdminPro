var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var usuario = require('../models/usuario');

app.get('/', (req, resp, next) => {
    usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return resp.status(500).json({
                        Result: false,
                        Message: 'error cargando usuarios',
                        errors: err
                    });
                }

                resp.status(200).json({
                    Result: true,
                    Usuarios: usuarios
                });
            });
});

app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;
    var usr = new usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usr.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                Result: false,
                Message: 'error al crear el usuario',
                errors: err
            });
        }
        resp.status(200).json({
            Result: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});




app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    usuario.findById(id, (err, usuario) => {
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
                Message: `El usuario ${id} no existe`,
                Errors: { Message: `El usuario ${id} no existe` }
            });
        }

        var body = req.body;
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    Result: false,
                    Message: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            resp.status(200).json({
                Result: true,
                usuario: usuarioGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificarToken, (req, resp, next) => {
    var id = req.params.id;
    usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return resp.status(400).json({
                Result: false,
                Message: `El usuario ${id} no existe`,
                Errors: { Message: `El usuario ${id} no existe` }
            });
        }

        resp.status(200).json({
            Result: true,
            usuario: usuarioEliminado
        });
    });

});

module.exports = app;