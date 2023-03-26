const oturumAcilmis = function (req, res, next) {
    if (req.isAuthenticated()) {                                 //passport kullandığımız için bize (.isAuthenticated())böyle bir method veriyor
        return next();
    }
    else {
        req.flash('error', ['You are not authorized, please login first']);        //app.js59 -req.flasha göre zaten login sayfamızı ayarlamıştık oradaki yapıyı bozmamam için aynı error olarak tanımladık
        res.redirect('/login');
    }
}

const oturumAcilmamis = function (req, res, next) {            //passportjs methoduyla othentication kontrolünü sağlıyoruz ve eğer oturum açılmamışsa ilgili adreslere gitsin açılmış ise de yönetim adresine gitsin(yönetimdeyken çıkış yapmadan diğer adreslere ulaşamasın)
    if (!req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/admin');
    }
}

module.exports = {
    oturumAcilmis,
    oturumAcilmamis
}