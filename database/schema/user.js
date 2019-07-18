const mongoose = require('../connect');
const Schema = mongoose.Schema;

const userSchema = Schema({
    nombre: {
        type: String,
        required: 'Falta el nombre'
    },
    email: {
        type: String,
        required: 'Falta el email',
        match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    password: String,
    telefono: Number,
    sexo:String,
    lat: Number,
    lon: Number,
    avatar: String,
    tipo: {
        type: String,
        required: 'Debe seleccionar tipo de usuario',
        enum: ['vendedor', 'comprador']// vendedor, comprador
    },
    mgusta: {
        type: Number,
        default: 0
    },
    nmgusta: {
        type: Number,
        default: 0
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },

});

const user= mongoose.model('User', userSchema);

module.exports = user;
