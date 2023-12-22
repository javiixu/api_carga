const express = require('express');
const router = express.Router();
const {borrarDb} = require("../controller/apiController.js");

router.get("/borrarDb", borrarDb)

module.exports = router;