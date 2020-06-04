var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
// var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var hospital = require('../models/hospital');


app.get('/', (req, resp, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospital.find({}, 'nombre img')
        .skip(desde)
        .limit(2)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return resp.status(500).json({
                    Result: false,
                    Message: 'error cargando usuarios',
                    errors: err
                });
            }

            hospital.count({}, (err, conteo) => {
                resp.status(200).json({
                    Result: true,
                    Hospitales: hospitales,
                    Cantidad: conteo
                });
            });

        });
});


app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;
    var hp = new hospital({
        nombre: body.nombre,
        usuario: req.usuario._id // -> el valor no importa se asigna automáticamente después del req.
    });

    hp.save((err, hospitalGuardado) => {
        if (err) {
            return resp.status(400).json({
                Result: false,
                Message: 'error al crear el usuario',
                errors: err
            });
        }
        resp.status(200).json({
            Result: true,
            hospital: hospitalGuardado
        });
    });
});


app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    hospital.findById(id, (err, hospital) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {
            return resp.status(400).json({
                Result: false,
                Message: `El hospital ${id} no existe`,
                Errors: { Message: `El hospital ${id} no existe` }
            });
        }

        var body = req.body;
        hospital.nombre = body.nombre;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return resp.status(400).json({
                    Result: false,
                    Message: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            resp.status(200).json({
                Result: true,
                hospital: hospitalGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificarToken, (req, resp, next) => {
    var id = req.params.id;
    hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al borrar el hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            return resp.status(400).json({
                Result: false,
                Message: `El hospital ${id} no existe`,
                Errors: { Message: `El hospital ${id} no existe` }
            });
        }

        resp.status(200).json({
            Result: true,
            hospital: hospitalEliminado
        });
    });

});

module.exports = app;