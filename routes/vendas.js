// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();


router.get("/vendas", (req, res) => {
    connection.query('SELECT * FROM produto', (err3, produtoResults) => {
        if (err3) {
            return
        }
        const teste = {TipoMovimentacao: "venda"} 
        connection.query('SELECT * FROM historico WHERE ?',teste, (err2, historicoResults) => {
            if (err2) {
                return
            }

            // Renderiza a view com os resultados
            produtoResults.forEach(produto => {
                produto.codico = (produto.CategoriaID * 10000) + produto.ProdutoID;
            });
            historicoResults.forEach(historico => {
                historico.codico = (historico.CategoriaID * 10000) + historico.ProdutoID;
            });
            res.render("vendas/index", {
                produtos: produtoResults,
                historicos: historicoResults
            });
        })
    });
})

router.post("/vendas/venderproduto", (req, res) => {
    var erros = []
    var i = req.body
    if(!i.codicoDeBarras || typeof i.codicoDeBarras == undefined || i.codicoDeBarras == null) {
        req.flash("errormsg","Codico de Barras Invalido");
        res.redirect("/vendas"); return;
    }
    if(!i.quantidade || typeof i.quantidade == undefined || i.quantidade == null) {
        req.flash("errormsg","Quantidade Invalido");
        res.redirect("/vendas"); return;
    }
    if(!i.totalAdicionado || typeof i.totalAdicionado == undefined || i.totalAdicionado == null) {
        req.flash("errormsg","Total Invalido");
        res.redirect("/vendas"); return;
    }
    if(!i.nproduto || typeof i.nproduto == undefined || i.nproduto == null) {
        req.flash("errormsg","Produto Invalido");
        res.redirect("/vendas"); return;
    }

    if(erros.length > 0) {
        req.flash("errormsg","Nome Invalido");
        res.redirect("/vendas"); return;
    } else {
        var categoriaID = Math.floor(i.codicoDeBarras / 10000);
        var produtoID = i.codicoDeBarras % 10000;
        var TipoMovimentacao = "venda"
        const selectpro = { ProdutoID: produtoID };
        connection.query('SELECT * FROM produto WHERE ?', selectpro, (err, results) => {
            if (err) {
                return;
            }
            if (results[0] ) {
                if (results[0].QuantidadeEmEstoque >= parseFloat(i.quantidade)) {
                    var QuantidadeEmEstoque = results[0].QuantidadeEmEstoque - parseFloat(i.quantidade);
                    const addpro = { Nome: i.nproduto, ProdutoID: produtoID, CategoriaID: categoriaID, TipoMovimentacao: TipoMovimentacao, FornecedorID: 0, Preco: removerFormatoMoeda(i.totalAdicionado), Quantidade: parseFloat(i.quantidade) };
                    connection.query('INSERT INTO historico SET ?', addpro, (err2, results2) => {
                        if (err2) {
                            return;
                        }
                        connection.query('UPDATE produto SET QuantidadeEmEstoque = ? WHERE ProdutoID = ?', [QuantidadeEmEstoque, produtoID], (err2, results2) => {
                            if (err2) {
                                return;
                            }
                        })
                        req.flash("sucessmsg","Produto vendido")
                        res.redirect("/vendas");
                    });
                } else {
                    req.flash("errormsg","Quantidade Insuficiente");
                    res.redirect("/vendas"); return;
                }
            } else {
                req.flash("errormsg","Produto Invalido");
                res.redirect("/vendas"); return;
            }
            
        });
    }
})



function removerFormatoMoeda(valorFormatado) {
    // Remove todos os caracteres que não são dígitos ou ponto
    const valorNumerico = valorFormatado
        .replace(/[R$.\s]/g, '') // Remove o símbolo de R$, espaços e ponto
        .replace(',', '.'); // Troca a vírgula por ponto para conversão

    // Converte para número
    return parseFloat(valorNumerico);
}

// EXPORT
module.exports = router