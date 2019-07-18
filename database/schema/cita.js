const mongoose = require('../connect');
const Schema = mongoose.Schema;

const citaSchema = Schema({
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require:'Requiere informacion del vendedor'
    },
    comprador: {// /api/user/id 
        type: Schema.Types.ObjectId,
        ref: "User",
        require:'Requiere informacion del comprador'
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require:'Requiere informacion del producto'
    },
    cantidad:{
        type:Number,
        require:'Requiere una cantidad de producto'
    },
    estado: {   // por confirmar, cancelada, terminada
        type: String,
        required: 'requiere un estado estado'
    },
    fechaCita: Date,
    horaCita: String,
    log: Number,
    lat: Number,
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const cita = mongoose.model('Cita', citaSchema);

module.exports = cita;
