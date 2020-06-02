var mongos = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var Schema = mongos.Schema;
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El correo es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} el correo debe ser único' });
module.exports = mongos.model('Usuario', usuarioSchema, 'Usuarios');