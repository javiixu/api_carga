const mongoose = require('mongoose');
const uuid = require('uuid');


const localidadSchema = new mongoose.Schema({    
    codigo: {
        type: String,
        unique: true,
        required: true,
        index: true,
        default: () => uuid.v4().replace(/-/g, '')
    },
    nombre: {
        type: String,
        trim: true,
        lowercase: true
    },
    codigoProvincia: {
        type: String,
        ref: "Provincia",
        localField: "codigo"
    },
});

const Localidad = mongoose.model('Localidad', localidadSchema);

module.exports = Localidad;