var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

var hospital = require('../models/hospital');
var medico = require('../models/medico');
var usuario = require('../models/usuario');

var app = express();
app.use(fileUpload());

app.put('/:tipo/:id', (req, resp, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;


    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        resp.status(400).json({
            Result: false,
            Message: 'Tipo no válido, tipos válidos ' + tiposValidos.join(',')
        });
    }

    if (!req.files) {
        resp.status(400).json({
            Result: false,
            Message: 'No se incluyó ningún archivo' + req.files
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        resp.status(400).json({
            Result: false,
            Message: 'Extensión no válida, extensiones válidas ' + extensionesValidas.join(',')
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            resp.status(400).json({
                Result: false,
                Message: 'Error al mover archivo'
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, resp);
        /* resp.status(200).json({
            Result: true,
            Message: 'Petición realizada correctamente'
        }); */
    });
});

function subirPorTipo(tipo, id, nombreArchivo, resp) {
    if (tipo === 'hospitales') {
        hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                resp.status(400).json({
                    Result: true,
                    Message: 'El hospital no existe'
                });
            }


            var pathViejo = './uploads/hospitales/' + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                hospitalActualizado.password = '';
                resp.status(200).json({
                    Result: true,
                    Message: 'Hospital actualizado',
                    Hospital: hospitalActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        medico.findById(id, (err, medico) => {
            if (!medico) {
                resp.status(400).json({
                    Result: true,
                    Message: 'El médico no existe'
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                medicoActualizado.password = '';
                resp.status(200).json({
                    Result: true,
                    Message: 'Médico actualizado',
                    Medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'usuarios') {
        usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                resp.status(400).json({
                    Result: true,
                    Message: 'El usuario no existe'
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = '';
                resp.status(200).json({
                    Result: true,
                    Message: 'Usuario actualizado',
                    usuario: usuarioActualizado
                });
            });
        });
    }

}

module.exports = app;