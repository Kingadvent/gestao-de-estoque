const localStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs")


module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'cnpj', passwordField: 'senha'}, (cnpj, senha, done) => {
        const verificar = { CNPJ: cnpj };
        connection.query('SELECT * FROM usuario WHERE ?', verificar, (err, results) => {
            if (err) {
                return done(null, false, {message: "Esta conta não existe"})  
            }
            if (results[0].CNPJ) {
                bcrypt.compare(senha, results[0].Senha, (erro, batem) => {
                    if (batem) {
                        return done(null, results[0])
                    } else {
                        return done(null, false, {message: "Senha incorreta"})
                    }
                })
            } else {
                return done(null, false, {message: "Esta conta não existe"})  
            }
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    passport.deserializeUser((id, done) => {
        const teste = {CNPJ: id.CNPJ}
        connection.query('SELECT * FROM usuario WHERE ?', teste, (err, results) => {
            if (err) {
                return done(null, false, { message: 'Algo deu errado' });
            }
            if (results.length > 0) {
                done(null, results[0]); // Retorna o primeiro resultado
            } else {
                done(null, false, { message: 'Usuário não encontrado' });
            }
        });
    });
    
    
}