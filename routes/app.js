var express = require('express');

var app = express();

app.get('/', (req, resp, next) => {
    resp.status(200).json({
        Result: true,
        Message: 'Petición realizada correctamente'
    });
});

module.exports = app;