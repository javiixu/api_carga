const { mappingCat } = require("../extractores/extractorCat.js");
const { mappingMur } = require("../extractores/extractorMur.js");
const { mappingVlc } = require("../extractores/extractorVlc.js");
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
    res.status(200).json('Se han borrado correctamente los datos de la base de datos') 
}

const carga = async (req, res) => {

    const cargas = req.body.demanda
    let resultados = {};

    console.log(cargas[1])

    if(cargas[0] === true){
        const resultadoMur = await cargaMur()
        resultados = { ...resultados, ...resultadoMur };
    }
    if(cargas[1] === true){
        const resultadoVlc = await cargaVlc()
        resultados = { ...resultados, ...resultadoVlc };
    }
    if(cargas[2] === true){
        const resultadoCat = await cargaCat()
        resultados = { ...resultados, ...resultadoCat };
    }


    res.status(200).json(resultados)

    
}

const cargaCat = async() => {
    const lista = await mappingCat()
    let resultadosCat = ""

    if(lista === undefined || (lista[0] == 0 && lista[1] == 0 && lista[2] == 0)){
        resultadosCat = {
            provinciasCat: `Número de provincias insertadas: 0`,
            localidadesCat: `Número de localidades insertadas: 0`,
            centrosEducativosCat: `Número de centros educativos insertados: 0`
        }
    }

    else {
        resultadosCat = {
            provinciasCat: `Número de provincias insertadas: ${lista[0]}`,
            localidadesCat: `Número de localidades insertadas: ${lista[1]}`,
            centrosEducativosCat: `Número de centros educativos insertados: ${lista[2]}`
        };

    }
    return resultadosCat
}

const cargaMur = async () => {
    const lista = await mappingMur()
    let resultadosMur = ""

    if(lista === undefined || (lista[0] == 0 && lista[1] == 0 && lista[2] == 0)){
        resultadosMur = {
            provinciasMur: `Número de provincias insertadas: 0`,
            localidadesMur: `Número de localidades insertadas: 0`,
            centrosEducativosMur: `Número de centros educativos insertados: 0`
        }
    }

    else {
        resultadosMur = {
            provinciasMur: `Número de provincias insertadas: ${lista[0]}`,
            localidadesMur: `Número de localidades insertadas: ${lista[1]}`,
            centrosEducativosMur: `Número de centros educativos insertados: ${lista[2]}`
        };
    }
    return resultadosMur
}

const cargaVlc = async() => {
    const lista = await mappingVlc()
    const resultadosVlc = ""

    if(lista === undefined || (lista[0] == 0 && lista[1] == 0 && lista[2] == 0)){
        resultadosVlc = {
            provinciasVlc: `Número de provincias insertadas: 0`,
            localidadesVlc: `Número de localidades insertadas: 0`,
            centrosEducativosVlc: `Número de centros educativos insertados: 0`
        }
    }

    else {
        const resultadosVlc = {
            provinciasVlc: `Número de provincias insertadas: ${lista[0]}`,
            localidadesVlc: `Número de localidades insertadas: ${lista[1]}`,
            centrosEducativosVlc: `Número de centros educativos insertados: ${lista[2]}`
        };
    }
    return resultadosVlc
}

module.exports = {
    borrarDb,
    carga
};

