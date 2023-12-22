const Centro_Educativo = require("../model/Centro_Educativo");
const Localidad = require("../model/Localidad");
const Provincia = require("../model/Provincia");

const borrarDb = async (req, res) => {
    await Promise.all([
        Centro_Educativo.deleteMany({}),
        Localidad.deleteMany({}),
        Provincia.deleteMany({})
    ]);
    console.log("Se han borrado correctamente los datos de la base de datos")
    res.status(200).json("Se han borrado correctamente los datos de la base de datos") 
}

module.exports = {
    borrarDb
};