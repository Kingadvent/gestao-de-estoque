// NPM INSTALL
const bcrypt = require("bcryptjs");
const express = require("express");

// Carregamento
const router = express.Router();
const {eGerente,eDono} = require("../helpers/eStaff");

router.get("/relatorio",eGerente, (req, res) => {
    const fornecedor = {};
    var totalvendas = 0.0;
    var totalcompras = 0.0;
    connection.query('SELECT * FROM fornecedor', (err3, fornecedorResults) => {
        if (err3) {
            console.error(err3);
            return res.status(500).send("Erro ao consultar.");
        }
        fornecedorResults.forEach(forn => {
            fornecedor[forn.FornecedorID] = forn
        })
    });
    connection.query('SELECT * FROM categoria', (err, categoriaResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao consultar categorias.");
        }
        connection.query('SELECT * FROM historico', (err2, historicoResults) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send("Erro ao consultar histórico.");
            }
            
            historicoResults.forEach(historico => {
                historico.codico = (historico.CategoriaID * 10000) + historico.ProdutoID;
                if(!fornecedor[historico.FornecedorID] || typeof fornecedor[historico.FornecedorID] == undefined || fornecedor[historico.FornecedorID] == null) {
                    historico.fornecedors = "Sem Informações"
                } else {
                    historico.fornecedors = fornecedor[historico.FornecedorID].Nome
                }
                if (historico.TipoMovimentacao == "venda") {
                    historico.venda = true
                    historico.fornecedors = "Pessoal Fisica"
                    totalvendas = totalvendas + parseFloat(historico.Preco);
                } else {
                    historico.venda = false
                    totalcompras = totalcompras + parseFloat(historico.Preco);
                }                
            });

            // Ordena o historico em ordem alfabética pelo nome
            historicoResults.sort((a, b) => a.codico - b.codico);
            var total = totalvendas-totalcompras;
            res.render("relatorio/index", {
                categoria: categoriaResults,
                historico: historicoResults,
                totalvendas: formatarMoeda(totalvendas),
                totalcompras: formatarMoeda(totalcompras),
                total: formatarMoeda(total),
                total2: total,
            });
        });
    });
});

router.get("/relatorio/info",eGerente, (req, res) => {
    const { categorias, pesquisaFiltro } = req.query;
    const fornecedor = {}
    connection.query('SELECT * FROM fornecedor', (err3, fornecedorResults) => {
        if (err3) {
            console.error(err3);
            return res.status(500).send("Erro ao consultar.");
        }
        fornecedorResults.forEach(forn => {
            fornecedor[forn.FornecedorID] = forn
        })
    });
    connection.query('SELECT * FROM categoria', (err, categoriaResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao consultar categorias.");
        }
        let query = 'SELECT * FROM historico WHERE 1=1';
        const params = [];
    
        // Verifica se uma categoria foi selecionada
        if (categorias && categorias > 0) {
            query += ' AND CategoriaID = ?';
            params.push(categorias);
        }
    
        // Verifica se há uma pesquisa pelo nome
        if (pesquisaFiltro) {
            query += ' AND Nome LIKE ?';
            params.push(`%${pesquisaFiltro}%`);
        }
        connection.query(query, params, (err2, historicoResults) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send("Erro ao consultar histórico.");
            }

            historicoResults.forEach(historico => {
                historico.codico = (historico.CategoriaID * 10000) + historico.ProdutoID;
                if(!fornecedor[historico.FornecedorID] || typeof fornecedor[historico.FornecedorID] == undefined || fornecedor[historico.FornecedorID] == null) {
                    historico.fornecedors = "Sem Informações"
                } else {
                    historico.fornecedors = fornecedor[historico.FornecedorID].Nome
                }
                if (historico.TipoMovimentacao == "venda") {
                    historico.venda = true
                    historico.fornecedors = "Pessoal Fisica"
                    totalvendas = totalvendas + parseFloat(historico.Preco);
                } else {
                    historico.venda = false
                    totalcompras = totalcompras + parseFloat(historico.Preco);
                }                
            });

            // Ordena o historico em ordem alfabética pelo nome
            historicoResults.sort((a, b) => a.codico - b.codico);
            var total = totalvendas-totalcompras;
            res.render("relatorio/index", {
                categoria: categoriaResults,
                historico: historicoResults,
                totalvendas: formatarMoeda(totalvendas),
                totalcompras: formatarMoeda(totalcompras),
                total: formatarMoeda(total),
                total2: total,
            });
        });
    });
})

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// EXPORT
module.exports = router