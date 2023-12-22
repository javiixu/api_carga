const Centro_Educativo = require("../model/Centro_Educativo");
const Localidad = require("../model/Localidad");
const Provincia = require("../model/Provincia");

const {getCatData} = require('../services/apiCat.js');

const mappingCat = async () => {
    let provinciasInsertadas = 0;
    let localidadesInsertadas = 0;
    let centrosEducativosInsertados = 0;

    const jsonContent = await getCatData();
    for(const item of jsonContent) {
        let currentLocalidad;
        let currentProvincia; 


                
        let tipo = "";
        if(item.nom_naturalesa == "Públic") tipo = "publico"
        else if(item.nom_naturalesa == "Privat") tipo = "privado"

        let nombreProvincia = ""
        let codigoProvincia = item.codi_postal.toString().slice(0,2)
        if(codigoProvincia == "08") nombreProvincia = "barcelona"
        else if(codigoProvincia == "17") nombreProvincia = "gerona"
        else if(codigoProvincia == "25") nombreProvincia = "lerida"
        else if(codigoProvincia == "43") nombreProvincia = "tarragona"

        //Comprobamos si existe la provincia en la base de datos, y si no, se crea una
        try {                
            const existingProvincia = await Provincia.findOne({ nombre: nombreProvincia });
            if (!existingProvincia) {                    
                const provincia = new Provincia({
                    nombre: nombreProvincia,
                    codigo: codigoProvincia,
                });                    
                currentProvincia = await provincia.save();
                provinciasInsertadas++;
                console.log("Se ha insertado la provincia: "+currentProvincia)
            } else {
                currentProvincia = existingProvincia
            }
        } catch (err) {
            console.error("Error al buscar o guardar en la base de datos:", err);
        }      

        //comprobar si existe alguna localidad en la bd con el mismo nombre, y si es asi, comprobar si la provincia es la misma. Si es la misma provincia no se inserta y si la localidad es de una provincia diferente se inserta.
        try {                
            const existingLocalidad = await Localidad.findOne({ nombre: item.nom_municipi });                

            if (existingLocalidad) {  
                if(existingLocalidad.codigoProvincia !== currentProvincia.codigo) {
                    const localidad = new Localidad({
                        nombre: item.nom_municipi,
                        codigoProvincia: currentProvincia.codigo
                    });      
                    currentLocalidad= await localidad.save();
                    localidadesInsertadas++;
                    console.log("Se ha insertado la localidad2: "+currentLocalidad)
                }
                else {
                    currentLocalidad = existingLocalidad;
                    console.log("No se ha insertado la localidad "+currentLocalidad)

                }
            
            } else {                    
                const localidad = new Localidad({
                    nombre: item.nom_municipi,
                    codigoProvincia: currentProvincia.codigo
                });  
                currentLocalidad= await localidad.save();
                localidadesInsertadas++;
                console.log("Se ha insertado la localidad: "+currentLocalidad)

            }
        } catch (err) {
            console.log("Error al buscar o guardar en la base de datos:", err);
        }

        try{
            const existingCentroEducativo = await Centro_Educativo.findOne({ nombre: item.denominaci_completa });

            if(!existingCentroEducativo) {
                const centro_educativo = new Centro_Educativo({
                    nombre: item.denominaci_completa,                  
                    tipo: tipo,
                    direccion: item.adre_a,
                    codigo_postal: item.codi_postal,
                    longitud: item.coordenades_geo_x,
                    latitud: item.coordenades_geo_y,
                    telefono: "", 
                    descripcion: item.estudis,
                    codigoLocalidad: currentLocalidad.codigo
                }); 
    
                const centroInsertado = await centro_educativo.save();                       
                centrosEducativosInsertados++;  
                console.log("Se ha insertado el centro: "+centroInsertado)
            }
            else {
                console.log("No se ha insertado el centro: "+existingCentroEducativo)
            }                                    


        }
        catch(err) {

        }

        console.log("----------------------------------------------------")                   
    }

    console.log(`Número de provincias insertadas: ${provinciasInsertadas}`);
    console.log(`Número de localidades insertadas: ${localidadesInsertadas}`);
    console.log(`Número de centros educativos insertados: ${centrosEducativosInsertados}`);

    return [provinciasInsertadas, localidadesInsertadas, centrosEducativosInsertados];

}


module.exports = {mappingCat}