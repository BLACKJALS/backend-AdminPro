var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var medico = require('../models/medico');


app.get('/', (req, resp, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    medico.find({})
        .skip(desde)
        .limit(2)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return resp.status(500).json({
                    Result: false,
                    Message: 'error cargando usuarios',
                    errors: err
                });
            }

            medico.count({}, (err, conteo) => {
                resp.status(200).json({
                    Result: true,
                    Medicos: medicos,
                    Cantidad: conteo
                });
            });
        });
});


app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;
    var nuevoMedico = new medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    nuevoMedico.save((err, medicoGuardado) => {
        if (err) {
            return resp.status(400).json({
                Result: false,
                Message: 'error al crear el médico',
                errors: err
            });
        }
        resp.status(200).json({
            Result: true,
            Medico: medicoGuardado
        });
    });
});


app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    medico.findById(id, (err, medico) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al buscar el hospital',
                errors: err
            });
        }

        if (!medico) {
            return resp.status(400).json({
                Result: false,
                Message: `El médico ${id} no existe`,
                Errors: { Message: `El médico ${id} no existe` }
            });
        }

        var body = req.body;
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    Result: false,
                    Message: 'Error al actualizar el médico',
                    errors: err
                });
            }
            resp.status(200).json({
                Result: true,
                Medico: medicoGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificarToken, (req, resp, next) => {
    var id = req.params.id;
    medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if (err) {
            return resp.status(500).json({
                Result: false,
                Message: 'error al borrar el médico',
                errors: err
            });
        }

        if (!medicoEliminado) {
            return resp.status(400).json({
                Result: false,
                Message: `El médico ${id} no existe`,
                Errors: { Message: `El médico ${id} no existe` }
            });
        }

        resp.status(200).json({
            Result: true,
            Medico: medicoEliminado
        });
    });

});


module.exports = app;