const mongoose = require('mongoose');
require('dotenv').config();

const Centro_Educativo = require("../model/Centro_Educativo");
const Localidad = require("../model/Localidad");
const Provincia = require("../model/Provincia");


const url = process.env.MONGO_URI || '';

async function connect() {    
    console.log("url: "+url)       
    await mongoose.connect(url);     
    console.log('Connected successfully to server');
}

async function close() {
    await client.close();
}

const deleteDataDb = async () => {
    await Promise.all([
        Centro_Educativo.deleteMany({}),
        Localidad.deleteMany({}),
        Provincia.deleteMany({})
    ]);
    console.log("Se han borrado correctamente los datos de la base de datos")
}

module.exports = {
    connect,
    close,
    deleteDataDb
};