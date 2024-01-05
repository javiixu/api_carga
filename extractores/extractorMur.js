const {getMurData} = require('../services/apiMur.js');

const Centro_Educativo = require("../model/Centro_Educativo");
const Localidad = require("../model/Localidad");
const Provincia = require("../model/Provincia");

const mappingMur = async () => {

    let provinciasInsertadas = 0;
    let localidadesInsertadas = 0;
    let centrosEducativosInsertados = 0;
    try {
        const jsonContent = await getMurData();    
        
        for(const item of jsonContent) {
            let currentLocalidad;
            let currentProvincia;  

            //Comprobamos si existe la provincia en la base de datos, y si no, se crea una
            try {                
                const existingProvincia = await Provincia.findOne({ nombre: "murcia" });
                if (!existingProvincia) {                    
                    const provincia = new Provincia({
                        nombre: "murcia",
                        codigo: "30",
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
                const existingLocalidad = await Localidad.findOne({ nombre: item.loccen });                

                if (existingLocalidad) {  
                    if(existingLocalidad.codigoProvincia !== currentProvincia.codigo) {
                        const localidad = new Localidad({
                            nombre: item.loccen,
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
                        nombre: item.loccen,
                        codigoProvincia: currentProvincia.codigo
                    });  
                    currentLocalidad= await localidad.save();
                    localidadesInsertadas++;
                    console.log("Se ha insertado la localidad: "+currentLocalidad)

                }
            } catch (err) {
                console.log("Error al buscar o guardar en la base de datos:", err);
            }


            let tipo = "";
            let geoReferencia = {};
            if (item.titularidad == "P") tipo = "publico";
            else if (item.titularidad == "C") tipo = "concertado";
            else if (item.titularidad == "N") tipo = "privado";

            if(item.hasOwnProperty("geo-referencia")) {
                geoReferencia = item["geo-referencia"]
            }
            else {
                geoReferencia.lon="";
                geoReferencia.lat=""
            }


            try{
                const existingCentroEducativo = await Centro_Educativo.findOne({ nombre: item.dencen });

                if(!existingCentroEducativo) {
                    const centro_educativo = new Centro_Educativo({
                        nombre: item.dencen,
                        tipo: tipo,
                        direccion: item.domcen,
                        codigo_postal: item.cpcen,
                        longitud: geoReferencia.lon,
                        latitud: geoReferencia.lat,
                        telefono: item.telcen,
                        descripcion: item.presentacionCorta,
                        codigoLocalidad: currentLocalidad.codigo
                    });  
        
                    if(item.cpcen) {
                        const centroInsertado = await centro_educativo.save();                       
                        centrosEducativosInsertados++;  
                        //console.log("Se ha insertado el centro: "+centroInsertado)
                    }
                    else {
                        console.log("No se ha insertado este centro porque no tiene codigo postal: "+centro_educativo+"\n")
                    }
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
        
    } catch (error) {
        console.error('Error al analizar el contenido JSON:', error);
    }
};



module.exports = {mappingMur}
