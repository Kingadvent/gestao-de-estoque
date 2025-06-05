// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();
const {eGerente,eDono} = require("../helpers/eStaff");

router.get("/fornecedor",eGerente, (req, res) => {
    connection.query('SELECT * FROM fornecedor', (err, fornecedorResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao consultar fornecedor.");
        }
        res.render("fornecedor/index",{
            fornecedores: fornecedorResults
        })
    });
})

router.post("/fornecedor/cadastrarFornecedor",eGerente, (req, res) => {
    var erros = []
    var i = req.body
    if(!i.Nome || typeof i.Nome == undefined || i.Nome == null) {
        req.flash("errormsg","Nome Invalido");
        res.redirect("/fornecedor"); return;
    }
    if(!i.Telefone || typeof i.Telefone == undefined || i.Telefone == null) {
        req.flash("errormsg","Telefone Invalido");
        res.redirect("/fornecedor"); return;
    }
    if(!i.cnpj || typeof i.cnpj == undefined || i.cnpj == null) {
        req.flash("errormsg","CNPJ Invalido");
        res.redirect("/fornecedor"); return;
    }
    if(!i.endereco || typeof i.endereco == undefined || i.endereco == null) {
        req.flash("errormsg","Endereço Invalido");
        res.redirect("/fornecedor"); return;
    }
    if(!i.email || typeof i.email == undefined || i.email == null) {
        req.flash("errormsg","Email Invalido");
        res.redirect("/fornecedor"); return;
    }

    if(erros.length > 0) {
        req.flash("errormsg","Invalido");
        res.redirect("/fornecedor"); return;
    } else {
        const addforn = { Nome: i.Nome, Endereco: i.endereco, Telefone: i.Telefone, Email: i.email, CNPJ: i.cnpj}
        connection.query('INSERT INTO fornecedor SET ?', addforn, (err2, results2) => {
            if (err2) {
                return; 
            }
            req.flash("sucessmsg","Fornecedor cadastrado")
            res.redirect("/fornecedor");
        });
    }
})

// EXPORT
module.exports = router