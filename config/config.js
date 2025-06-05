// NPM INSTALL
const express = require("express");

// Carregamento
const router = express.Router();

global.port = 58433;
global.MeuBancodeDados = true;
global.MeuSQL = {
    host: 'localhost',
    user: 'root',
    database: 'gestao'
}

global.ExportSQL = {
    host: '',
    user: '',
    database: '',
    port:58433
}

module.exports = router