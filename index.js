const express = require('express');
require('dotenv').config();
const { connect, close, deleteDataDb } = require('./db/db.js');
const app = express();
const port = process.env.PORT ||8000;
const routes = require('./routes/routes.js');

const {mappingVlc} = require('./extractores/extractorVlc.js')
const {mappingMur} = require('./extractores/extractorMur.js')
const {mappingCat} = require('./extractores/extractorCat.js')

const main = async () => {
    await connect()
    await deleteDataDb()
    console.log("CATALUÑA: ")
    await mappingCat()
    /*console.log("VALENCIA: ")
    await mappingCsv()*/
    /*console.log("MURCIA: ")
    await mappingMur()    */
}

app.listen(port, () => console.log(`Listening on port ${port}`));

main();

