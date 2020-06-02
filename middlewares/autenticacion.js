var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Validar token -> middleware

exports.verificarToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                Result: false,
                Message: 'TokenIvalid',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};