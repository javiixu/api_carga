const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connect, close } = require('./db/db.js');
const app = express();
const port = process.env.PORT ||8000;
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');

const {mappingVlc} = require('./extractores/extractorVlc.js')
const {mappingMur} = require('./extractores/extractorMur.js')
const {mappingCat} = require('./extractores/extractorCat.js')

app.use(cors());

app.use(bodyParser.json());

app.use('/', routes);

const main = async () => {
    await connect()
    //await borrarDb()
    /*console.log("CATALUÑA: ")
    await mappingCat()*/
    /*console.log("VALENCIA: ")
    await mappingCsv()*/
    /*console.log("MURCIA: ")
    await mappingMur()    */
}

app.listen(port, () => console.log(`Listening on port ${port}`));

main();

