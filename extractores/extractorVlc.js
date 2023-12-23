const { Builder, By, until } = require('selenium-webdriver');

const { getVlcData } = require('../services/apiVlc.js');

const Centro_Educativo = require("../model/Centro_Educativo");
const Localidad = require("../model/Localidad");
const Provincia = require("../model/Provincia");


let provinciasInsertadas = 0;
let localidadesInsertadas = 0;
let centrosEducativosInsertados = 0;

const mappingVlc = async () => {

  let provinciasInsertadas = 0;
  let localidadesInsertadas = 0;
  let centrosEducativosInsertados = 0;
  
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.coordenadas-gps.com/');
  let latitud, longitud;

  const jsonData = await getVlcData();

  for (const item of jsonData) {
    let currentLocalidad;
    let currentProvincia;
    let codigoProvincia;

    if (item.CODIGO_POSTAL.length === 4) {
      codigoProvincia = '0' + item.CODIGO_POSTAL.toString().slice(0, 1);
    } else { codigoProvincia = item.CODIGO_POSTAL.toString().slice(0, 2) }

    let tipo = "";
    if (item.REGIMEN == "PÚB.") tipo = "publico";
    else if (item.REGIMEN == "PRIV.") tipo = "privado";
    else if (item.REGIMEN == "PRIV. CONC.") tipo = "concertado";
    else if (item.REGIMEN == "OTROS") tipo = "otros";

    //Comprobamos si existe la provincia en la base de datos, y si no, se crea una
    try {
      const existingProvincia = await Provincia.findOne({ nombre: item.PROVINCIA });
      if (!existingProvincia) {
        const provincia = new Provincia({
          nombre: item.PROVINCIA,
          codigo: codigoProvincia,
        });
        currentProvincia = await provincia.save();
        provinciasInsertadas++;
        console.log("Se ha insertado la provincia: " + currentProvincia)
      } else {
        currentProvincia = existingProvincia
      }
    } catch (err) {
      console.error("Error al buscar o guardar en la base de datos:", err);
    }

    //comprobar si existe alguna localidad en la bd con el mismo nombre, y si es asi, comprobar si la provincia es la misma. Si es la misma provincia no se inserta y si la localidad es de una provincia diferente se inserta.
    try {
      const existingLocalidad = await Localidad.findOne({ nombre: item.LOCALIDAD });

      if (existingLocalidad) {
        if (existingLocalidad.codigoProvincia !== currentProvincia.codigo) {
          const localidad = new Localidad({
            nombre: item.LOCALIDAD,
            codigoProvincia: currentProvincia.codigo
          });
          currentLocalidad = await localidad.save();
          localidadesInsertadas++;
          console.log("Se ha insertado la localidad: " + currentLocalidad)
        }
        else {
          currentLocalidad = existingLocalidad;
          console.log("No se ha insertado la localidad " + currentLocalidad)

        }

      } else {
        const localidad = new Localidad({
          nombre: item.LOCALIDAD,
          codigoProvincia: currentProvincia.codigo
        });
        currentLocalidad = await localidad.save();
        localidadesInsertadas++;
        console.log("Se ha insertado la localidad: " + currentLocalidad)

      }
    } catch (err) {
      console.log("Error al buscar o guardar en la base de datos:", err);
    }

    try {
      const existingCentroEducativo = await Centro_Educativo.findOne({ nombre: item.DENOMINACION });

      if (!existingCentroEducativo) {
        let direccion = item.TIPO_VIA + " " + item.DIRECCION + " " + item.NUMERO;
        let subida = direccion + " , " + item.LOCALIDAD + " , " + " , ESPAÑA";

        //Cogemos las coordenadas de coordenadas.com
        try {

          // Espera a que el elemento del cuadro de texto "address" esté presente
          const address = await driver.wait(until.elementLocated(By.id('address')), 5000);

          await driver.sleep(2000);

          address.clear();

          address.sendKeys(subida);

          const boton = await driver.wait(until.elementLocated(By.css('button[onclick*="codeAddress()"]')), 5000);

          await boton.click();

          try {
            // Espera a que aparezca la alerta antes de intentar interactuar con ella
            await driver.wait(until.alertIsPresent(), 2000);

            // Ahora puedes interactuar con la alerta
            await driver.switchTo().alert().accept();
          } catch (alertError) {
            // Maneja el error de alerta (puede ignorarse ya que no siempre estará presente)
          }

          await driver.sleep(1000);

          const elemLatitud = await driver.findElement(By.id('latitude'))
          const elemLongitud = await driver.findElement(By.id('longitude'))

          latitud = await elemLatitud.getAttribute('value');
          longitud = await elemLongitud.getAttribute('value');

          console.log("Latitud: " + latitud);
          console.log("Longitud: " + longitud);


        } finally { }

        let codigo_postal = item.CODIGO_POSTAL;

        if (item.CODIGO_POSTAL.length === 4) {
          codigo_postal = '0' + item.CODIGO_POSTAL;
        }

        if (item.TELEFONO.length !== 9) {
          item.TELEFONO = null;
        }

        const centro_educativo = new Centro_Educativo({
          nombre: item.DENOMINACION,
          tipo: tipo,
          direccion: direccion,
          codigo_postal: codigo_postal,
          telefono: item.TELEFONO,
          descripcion: item.URL_ES,
          latitud: latitud,
          longitud: longitud
        });

        const centroInsertado = await centro_educativo.save();
        centrosEducativosInsertados++;
        console.log("Se ha insertado el centro: " + centroInsertado)
      }
      else {
        console.log("No se ha insertado el centro: " + existingCentroEducativo)
      }
    }
    catch (err) {

    }

    console.log("----------------------------------------------------")
  }

  await driver.quit();

  console.log(`Número de provincias insertadas: ${provinciasInsertadas}`);
  console.log(`Número de localidades insertadas: ${localidadesInsertadas}`);
  console.log(`Número de centros educativos insertados: ${centrosEducativosInsertados}`);

  return [provinciasInsertadas, localidadesInsertadas, centrosEducativosInsertados];
}

module.exports = { mappingVlc };