// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();


router.get("/estoque", (req, res) => {
    // Primeira consulta: categorias
    connection.query('SELECT * FROM categoria', (err, categoriaResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao consultar categorias.");
        }

        // Segunda consulta: fornecedores
        connection.query('SELECT * FROM fornecedor', (err2, fornecedorResults) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send("Erro ao consultar fornecedores.");
            }

            // Terceira consulta: produtos
            connection.query('SELECT * FROM produto', (err3, produtoResults) => {
                if (err3) {
                    console.error(err3);
                    return res.status(500).send("Erro ao consultar produtos.");
                }

                // Renderiza a view com os resultados
                produtoResults.forEach(produto => {
                    produto.codico = (produto.CategoriaID * 10000) + produto.ProdutoID;
                    produto.Validade = formatarData(produto.Validade);
                    produto.Fabricacao = formatarData(produto.Fabricacao);
                });
                res.render("estoque/index", {
                    categoria: categoriaResults,
                    fornecedor: fornecedorResults,
                    produtos: produtoResults
                });
            });
        });
    });
});


function formatarData(data) {
    const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return data.toLocaleDateString('pt-BR', opcoes);
}

router.post("/estoque/cadastrarproduto", (req, res) => {
    var erros = []
    var i = req.body
    if(!i.nome || typeof i.nome == undefined || i.nome == null) {
        req.flash("errormsg","Nome Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.descricao || typeof i.descricao == undefined || i.descricao == null) {
        req.flash("errormsg","Descricao Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.quantidade || typeof i.quantidade == undefined || i.quantidade == null) {
        req.flash("errormsg","Quantidade Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.preco || typeof i.preco == undefined || i.preco == null) {
        req.flash("errormsg","Preco Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.dataDeValidade || typeof i.dataDeValidade == undefined || i.dataDeValidade == null) {
        req.flash("errormsg","Data de Validade Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.dataDeFabricacao || typeof i.dataDeFabricacao == undefined || i.dataDeFabricacao == null) {
        req.flash("errormsg","Data de Fabricação Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.categorias || typeof i.categorias == undefined || i.categorias == null) {
        req.flash("errormsg","Categoria Invalido");
        res.redirect("/estoque"); return;
    }
    if(!i.fornecedors || typeof i.fornecedors == undefined || i.fornecedors == null) {
        req.flash("errormsg","Fornecedor Invalido");
        res.redirect("/estoque"); return;
    }
    if(i.dataDeFabricacao > i.dataDeValidade) {
        req.flash("errormsg","Data de Validade antes da Fabricação");
        res.redirect("/estoque"); return;
    }

    const verificar = { Nome: i.nome };
    if(erros.length > 0) {
        res.redirect("/estoque"); return;
    } else {
        connection.query('SELECT * FROM produto WHERE ?', verificar, (err, results) => {
            if (err) {
                return;
            }
            if (results[0]) {
                req.flash("errormsg","produto ja existe")
                res.redirect("/estoque");
            } else {
                const addpro = { Nome: i.nome, Descricao: i.descricao, Preco: i.preco, QuantidadeEmEstoque: i.quantidade, CategoriaID: i.categorias, FornecedorID: i.fornecedors, Validade: i.dataDeValidade, Fabricacao: i.dataDeFabricacao };
                connection.query('INSERT INTO produto SET ?', addpro, (err2, results2) => {
                    if (err2) {
                        return;
                    }
                    req.flash("sucessmsg","Produto cadastrado")
                    res.redirect("/estoque");
                    addRelatorio(i);
                });
            }
        })
    }
})

function addRelatorio(i) {
    const verificar = { Nome: i.nome };
    connection.query('SELECT * FROM produto WHERE ?', verificar, (err, results) => {
        if (err) {
            return;
        }

        if (results[0]) {
            const TipoMovimentacao = "compra";
            const valor = results[0].Preco * results[0].QuantidadeEmEstoque;
            const addpro = { Nome: results[0].Nome, ProdutoID: results[0].ProdutoID, CategoriaID: results[0].CategoriaID, FornecedorID: results[0].FornecedorID, TipoMovimentacao: TipoMovimentacao, Preco: parseFloat(valor), Quantidade: parseFloat(results[0].QuantidadeEmEstoque) };
            connection.query('INSERT INTO historico SET ?', addpro, (err2, results2) => {
                if (err2) {
                    return;
                }
            });
        }
        
    })
}



// EXPORT
module.exports = router