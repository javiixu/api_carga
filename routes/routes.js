const express = require('express');
const router = express.Router();
const {borrarDb, carga} = require("../controller/apiController.js");

router.get("/borrarDb", borrarDb)

router.post("/carga", carga)

module.exports = router;