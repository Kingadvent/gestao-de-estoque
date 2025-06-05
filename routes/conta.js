// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();


router.get("/conta", (req, res) => {
    res.render("conta/index")
})

// EXPORT
module.exports = router