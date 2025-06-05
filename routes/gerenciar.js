// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();
const {eGerente,eDono} = require("../helpers/eStaff");

router.get("/gerenciar",eDono, (req, res) => {
    connection.query('SELECT * FROM usuario', (err, usuarioResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao consultar usuario.");
        }
        res.render("gerenciar/index", {
            usuario: usuarioResults
        })
    });
})

router.get("/setgrupo/:id/:perm",eDono, (req,res) => {
    if (req.user.UsuarioID == req.params.id) {
        req.flash("errormsg","Você não pode mudar sua permissão");
        res.redirect("/gerenciar"); return;
    } else {
        connection.query('UPDATE usuario SET Permissao = ? WHERE UsuarioID = ?',[parseInt(req.params.perm),parseInt(req.params.id)], (err, usuarioResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao consultar usuario.");
            }
            req.flash("sucessmsg","Gerenciamento Completo")
            res.redirect("/gerenciar"); return;
        });
    }
})

router.get("/removeuser/:id/:perm",eDono, (req,res) => {
    if (req.user.UsuarioID == req.params.id) {
        req.flash("errormsg","Você não pode se remover");
        res.redirect("/gerenciar"); return;
    } else {
        connection.query('DELETE FROM usuario WHERE UsuarioID = ?',[parseInt(req.params.id)], (err, usuarioResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao consultar usuario.");
            }
            req.flash("sucessmsg","Usuario Deletado com Sucesso")
            res.redirect("/gerenciar"); return;
        });
    }
})

router.get("/limpars/:sql",eDono, (req,res) => {

    const sql = 'TRUNCATE TABLE '+ req.params.sql;
    connection.query(sql, (err, limpado) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao Limpar.");
        }
        const sql2 = 'ALTER TABLE '+ req.params.sql +' AUTO_INCREMENT = 1';
        connection.query(sql2, (err2, autoincrement) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send("Erro ao Trocar a Table.");
            }
            
        });
        req.flash("sucessmsg","Gerenciamento Limpado "+ req.params.sql)
        res.redirect("/gerenciar"); return;
    });


})

// EXPORT
module.exports = router