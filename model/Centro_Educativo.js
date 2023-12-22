const mongoose = require('mongoose');

const centroEducativoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
    },
    tipo: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ['publico', 'concertado', 'privado', 'otros']
    },
    direccion: {
        type: String,
        trim: true,
    },
    codigo_postal: {
        type: String,
    },
    longitud: {
        type: Number,
    },
    latitud: {
        type: Number,
        trim: true,
    },
    telefono: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    codigoLocalidad: {
        type: String,
        ref: "Localidad",
        localField: "codigo"
    },
});

const CentroEducativo = mongoose.model('CentroEducativo', centroEducativoSchema);

module.exports = CentroEducativo;