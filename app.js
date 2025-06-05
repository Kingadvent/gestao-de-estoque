// NPM INSTALL
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("cookie-session");
const express = require("express");
const handlebars = require("express-handlebars");
const passport = require("passport");
const path = require('path');
const fs = require('fs');

// Carregamento
const app = express();
require("./config/auth")(passport);
require("./config/config")
// const db = require("./config/db");

// Carregamento Routes exemplos
const vendas = require("./routes/vendas");
const estoque = require("./routes/estoque");
const relatorio = require("./routes/relatorio");
const conta = require("./routes/conta");
const fornecedor = require("./routes/fornecedor");
const categoria = require("./routes/categoria");
const gerenciar = require("./routes/gerenciar");
// const {eAdmin,eGrupo} = require("./helpers/eStaff");
const {eGerente,eDono} = require("./helpers/eStaff");
global.mysql = require('mysql2');
console.clear();

if (global.MeuBancodeDados) {
    console.log('Banco de Dados: LocalHost');
    global.connection = mysql.createConnection(global.MeuSQL);
} else {
    console.log('Banco de Dados: '+ global.ExportSQL.user);
    global.connection = mysql.createConnection(global.ExportSQL);
}

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL...\n');
});

// Configuração
    // Sessão
    app.use(session({
        secret: "estgestao",
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    // MiddleWare
    app.use((req, res, next) => {
        res.locals.sucessmsg = req.flash("sucessmsg");
        res.locals.errormsg = req.flash("errormsg");
        res.locals.error = req.flash("error");
        
        // res.locals.user = req.user || null;
        if(req.user){
            res.locals.user = req.session.user = req.user || null;

        }
        next()
    })
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    // HandleBars
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        helpers: {
            gt: (a, b) => a > b,
            eq: (a, b) => a === b
        }
    }))
    app.set('view engine', 'handlebars');
    // Public
    app.use(express.static(path.join(__dirname,"public")))

// Rotas
    app.get("/",(req, res) => {
        res.render("index", { 
            // contexto: bibliaDiaria,
        });
    })

    app.get("/registrar",(req,res) => {
        res.render("registrar", { 
            // contexto: bibliaDiaria,
        });
    })

    app.get("/esquecisenha",(req,res) => {
        res.render("esquecisenha", { 
            // contexto: bibliaDiaria,
        });
    })

    app.post("/login", (req,res,next) => {
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/",
            failureFlash: true
        })(req, res, next)

    })

    app.get("/logout", (req, res, next) => {
        req.logOut()  // <-- not req.logout();
        req.flash("sucessmsg","Deslogado com sucesso")
        res.redirect('/')
    })

    app.post("/recuperarsenha", (req,res) => {
        var i = req.body
        console.log("b")
        if(!i.cnpj || typeof i.cnpj == undefined || i.cnpj == null) {
            req.flash("errormsg","CNPJ Invalido");
            res.redirect("/esquecisenha"); return;
        }
        if(!i.email || typeof i.email == undefined || i.email == null) {
            req.flash("errormsg","Email Invalido");
            res.redirect("/esquecisenha"); return;
        }
        if(!i.senha || typeof i.senha == undefined || i.senha == null) {
            req.flash("errormsg","Senha Invalido");
            res.redirect("/esquecisenha"); return;
        }
        const verificar = { CNPJ: i.cnpj };
        connection.query('SELECT * FROM usuario WHERE ?', verificar, (err, results) => {
            if (err) {
                req.flash("sucessomsg","Erro na Atualização da Senha")
                return;
            }
            if (results[0]) {
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(i.senha, salt, (erro,hash) => {
                        i.senha = hash;
                        connection.query('UPDATE usuario SET Senha = ? WHERE CNPJ = ?', [i.senha,i.cnpj], (err, updatesenha) => {
                            if (err) {
                                req.flash("sucessomsg","Erro na Atualização da Senha")
                                return;
                            }
                            if (updatesenha[0]) {
                                req.flash("errormsg","Senha Alterada")
                                res.redirect("/");
                                passport.authenticate("local", {
                                    successRedirect: "/",
                                    failureRedirect: "/",
                                    failureFlash: true
                                })(req, res, next)
                            }
                        });
                    });
                });
            }
        })
        
    })

    app.post("/registrado", (req,res) => {
        var erros = []
        var i = req.body

        if(!i.cnpj || typeof i.cnpj == undefined || i.cnpj == null) {
            req.flash("errormsg","CNPJ Invalido");
            res.redirect("/registrar"); return;
        }

        if(!i.senha || typeof i.senha == undefined || i.senha == null) {
            req.flash("errormsg","Senha Invalido");
            res.redirect("/registrar"); return;
        }

        if(!i.email || typeof i.email == undefined || i.email == null) {
            req.flash("errormsg","Email Invalido");
            res.redirect("/registrar"); return;
        }

        if(!i.telefone || typeof i.telefone == undefined || i.telefone == null) {
            req.flash("errormsg","Telefone Invalido");
            res.redirect("/registrar"); return;
        }

        if(!i.cep || typeof i.cep == undefined || i.cep == null) {
            req.flash("errormsg","CEP Invalido");
            res.redirect("/registrar"); return;
        }

        if(!i.ncasa || typeof i.ncasa == undefined || i.ncasa == null) {
            req.flash("errormsg","Numero de Casa Invalido");
            res.redirect("/registrar"); return;
        }


        if(erros.length > 0) {
            req.flash("errormsg","Invalido");
            res.redirect("/registrar"); return;
        } else {
            const verificar = { CNPJ: i.cnpj };
            connection.query('SELECT * FROM usuario WHERE ?', verificar, (err, results) => {
                if (err) {
                    return;
                }
                if (results[0]) {
                    req.flash("errormsg","Invalido");
                    res.redirect("/registrar"); return;
                } else {
                    const addUser = { CNPJ: i.cnpj, Senha: i.senha, CEP: i.cep, Email: i.email, Telefone: i.telefone, Casa: i.ncasa };
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(addUser.Senha, salt, (erro,hash) => {
                            addUser.Senha = hash;
                            connection.query('INSERT INTO usuario SET ?', addUser, (err2, results2) => {
                                if (err2) {
                                    return;
                                }
                                
                                res.redirect("/");
                            });
                        });
                    });
                }
            });

        }
    })

    app.get("/404", (req, res) => {
        res.send("Error 404!");
    })

    

    app.use("/",vendas) // linha 18 parte usuario
    app.use("/",estoque) 
    app.use("/",relatorio) 
    app.use("/",conta) 
    app.use("/",fornecedor) 
    app.use("/",categoria) 
    app.use("/",gerenciar) 


// Outros
    const PORT = process.env.PORT || global.port;
    app.listen(PORT, () => {
        console.log("Servidor Rodando...")
    })
    