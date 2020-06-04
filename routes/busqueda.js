var express = require('express');
var app = express();

var hospital = require('../models/hospital');
var medico = require('../models/medico');
var usuario = require('../models/usuario');

// Búsqueda por colección
app.get('/coleccion/:tabla/:busqueda', (req, resp, next) => {
    var tabla = req.params.tabla;
    var termSearch = req.params.busqueda;
    var regex = new RegExp(termSearch, 'i');
    var promise;

    switch (tabla) {
        case 'usuario':
            promise = buscarUsuarios(regex);
            break;
        case 'medico':
            promise = buscarMedicos(regex);
            break;
        case 'hospital':
            promise = buscarHospitales(regex);
            break;
        default:
            resp.status(400).json({
                Result: true,
                Message: 'Los tipos de búsqueda solo son: usuario, médicos y hospitales',
                Error: { Message: 'Tipo de colección no válida' }
            });
    }

    promise.then(data => {
        resp.status(200).json({
            Result: true,
            [tabla]: data
        });
    });

});


// Búsqueda general

app.get('/todo/:busqueda', (req, resp, next) => {
    var termSearch = req.params.busqueda;
    var regex = new RegExp(termSearch, 'i');
    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(response => {
        resp.status(200).json({
            Result: true,
            Hospitales: response[0],
            Medicos: response[1],
            Usuarios: response[2]
        });
    });
});

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('Hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        usuario.find({}, 'email nombre role').or([{ 'nombre': regex }, { 'email': regex }]).exec((err, usuarios) => {
            if (err) {
                reject('error al cargar usuarios', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;