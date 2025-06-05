// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();


router.get("/categoria", (req, res) => {
    connection.query('SELECT * FROM categoria', (err, categoriaResults) => {
        if (err) {
            return res.status(500).send("Erro ao consultar categorias.");
        }
        res.render("categoria/index", {
            categorias: categoriaResults
        })
    });
})

router.post("/categoria/cadastrar", (req, res) => {
    var i = req.body
    if(!i.nome || typeof i.nome == undefined || i.nome == null) {
        req.flash("errormsg","nome Invalido");
        res.redirect("/categoria"); return;
    }
    if(!i.descricao || typeof i.descricao == undefined || i.descricao == null) {
        req.flash("errormsg","Descrição Invalido");
        res.redirect("/categoria"); return;
    }

    const verificar = { Nome: i.nome };
    connection.query('SELECT * FROM categoria WHERE ?', verificar, (err, results) => {
        if (err) {
            return;
        }
        if (results[0]) {
            req.flash("errormsg","Categoria Ja Existe");
            res.redirect("/categoria"); return;
        } else {
            const addpro = { Nome: i.nome, Descricao: i.descricao };
            connection.query('INSERT INTO categoria SET ?', addpro, (err2, results2) => {
                if (err2) {
                    return;
                }
                req.flash("sucessmsg","Categoria cadastrada")
                res.redirect("/categoria");
            });
        }
    })
})

// EXPORT
module.exports = router