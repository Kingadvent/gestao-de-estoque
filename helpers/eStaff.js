module.exports = {
    eGerente: function(req, res, next){
        if(req.isAuthenticated() && req.user.Permissao >= 2){
            return next();
        }
        req.flash("errormsg","Você precisa ser um Gerente!")
        res.redirect("/")
    },
    eDono: function(req, res, next){
        if(req.isAuthenticated() && req.user.Permissao >= 3){
            return next();
        }
        req.flash("errormsg","Você precisa ser um Dono!")
        res.redirect("/")
    },
}