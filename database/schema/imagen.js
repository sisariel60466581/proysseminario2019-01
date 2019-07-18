
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const imagenSchema = Schema({
    nombre : String,
    idUsuario: String,
    path : String,   
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const imagen = mongoose.model('Imagen', imagenSchema);

module.exports = imagen;