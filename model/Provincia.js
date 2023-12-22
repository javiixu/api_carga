const mongoose = require('mongoose');

const provinciaSchema = new mongoose.Schema({   
    codigo: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    nombre: {
        type: String,
        trim: true,
        lowercase: true
    },
});

const Provincia = mongoose.model('Provincia', provinciaSchema);

module.exports = Provincia;