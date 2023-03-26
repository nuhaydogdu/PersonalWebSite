const { validationResult } = require('express-validator');   
const User = require('../model/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const passport = require('passport');
require('../config/passport_local')(passport);

const loginFormGoster = (req, res) => {
    res.render('login', { layout: './layout/auth_layout.ejs' })
}

const loginOl = async (req, res, next) => {

    const hatalar = validationResult(req);

    req.flash('email', req.body.email);
    req.flash('sifre', req.body.sifre);

    if (!hatalar.isEmpty()) {
        req.flash('validation_error', hatalar.array());
        res.redirect('/login');

    } else {
        passport.authenticate('local', {   //'local' diyerek çağırdığımız bu yapı passport_local.js deki strategyi kullanarak işlemler yapacak
            successRedirect: '/admin',   //başarılı işlemlerde bu rotaya
            failureRedirect: '/login',     //hata çıkarsa bu rotaya yolla 
            failureFlash: true             //1-bu flash yapısı passport_local.js de olası hata messageleri -sessionumuzda -flash altındaki -error içerisinde array olarak anlık kaydediyor 
        })(req, res, next); 

    }
}

const forgetPasswordFormunuGoster = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs' });
}

const forgetPassword = async (req, res, next) => {

    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);

        res.redirect('/forget-password');

    }

    else {

        try {
            const _user = await User.findOne({ email: req.body.email });

            if (_user) {
                //kullanıcıya şifre sıfırlama maili atılabilir  

                //JWT İŞLEMLERİ
                const jwtBilgileri = {
                    id: _user._id,
                    mail: _user.email
                };
                const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.sifre;                   //bunu yapmaktaki amacımız mail gönderdiğimiz link tek kullanımlık olsun. Linke basıp şifreyi değiştirince yeni bir token oluşturuluyor ve maildeki link geçersiz oluyor
                const jwtToken = jwt.sign(jwtBilgileri, secret, { expiresIn: '1d' });

                //MAIL GONDERME ISLEMLERI
                const url = process.env.WEB_SITE_URL + 'reset-password/' + _user._id + "/" + jwtToken;      //mail olarak gönderilen linkin yapısı


                let transporter = nodemailer.createTransport({                                              //mail gönderme yolunu seçiyoruz gmail olarak ve benim maillerimi atacak olan hesabın username  ve password alanlarını geçiyorum
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_SIFRE
                    }
                });

                await transporter.sendMail({                                                               //gönderilen mailin içerik kısmı

                    from: 'ayddnuh <nuhaydd25@gmail.com',
                    to: _user.email,
                    subject: "Şifre Güncelleme",
                    text: "Şifrenizi oluşturmak için lütfen linki tıklayın:" + url

                }, (error, info) => {
                    if (error) {
                        console.log("bir hata var" + error);
                    }
                    transporter.close();
                });

                req.flash('success_message', [{ msg: 'Please check your mailbox' }]);
                res.redirect('/login');


            } else {
                req.flash('validation_error', [{ msg: "This email is not registered" }]);
                req.flash('email', req.body.email);
                res.redirect('forget-password');
            }

        } catch (err) {
            console.log("user kaydedilirken hata cıktı " + err);
        }

    }
}

const yeniSifreFormuGoster = async (req, res, next) => {
    const linktekiID = req.params.id;
    const linktekiToken = req.params.token;

    if (linktekiID && linktekiToken) { 

        const _bulunanUser = await User.findOne({ _id: linktekiID });                             //linkten gelen id değerine göre veri tabanımımızda useri buluyoruz

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.sifre;          //ilk başta şifrem 1234 böyleyken forget-password istekte bulunursam 1234 e göre toykem yollanıyor ve secret key oluşturuluyor şifremi  67789 değiştirip ikinci defa o linke istekte bulunduğumda bu token verify edilemeyecektir
                    
        try {
            jwt.verify(linktekiToken, secret, async (e, decoded) => {

                if (e) {
                    req.flash('error', 'Kod Hatalı veya Süresi Geçmiş');
                    res.redirect('/forget-password');
                } else {


                    res.render('new_password', { id: linktekiID, token: linktekiToken, layout: './layout/auth_layout.ejs', title: 'Şifre Güncelle' });
                     //(1) new_password render edildiğinde artık linkimdeki (id: linktekiID ve token: linktekiToken) değerlerine erişebilirim
                }
            });
        } catch (err) {

        }

    } else {
        req.flash('validation_error', [{ msg: "Lütfen maildeki linki tıklayın. Token Bulunamadı" }]);

        res.redirect('forget-password');
    }
}

const yeniSifreyiKaydet = async (req, res, next) => {
    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('sifre', req.body.sifre);
        req.flash('resifre', req.body.resifre);

        console.log("formdan gelen değerler");
        console.log(req.body);
        //console.log(req.session);                                                 //bir hata olduğunda '/reset-password/' get isteğiyle adresine gidersek routerden yeniSifreFormuGoster controllerine aktaracak ve burada id token değerleri gerekecek
        res.redirect('/reset-password/' + req.body.id + "/" + req.body.token);      //(3) id ve token değerlerini eklememiz gerekiyor linkin bozulmaması için  

    } else {

        const _bulunanUser = await User.findOne({ _id: req.body.id});         //buradaki id değişkenimizi formun içine koyduğumuz için hacklenmeye müsaitti o yüzden doğrulama işlelmi yaptık

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.sifre;         //bu adıma kadar hala şifre güncellenmedi 
                  
        try {
            jwt.verify(req.body.token, secret, async (e, decoded) => {

                if (e) {
                    req.flash('error', 'Kod Hatalı veya Süresi Geçmiş');
                    res.redirect('/forget-password');
                } else {

                    const hashedPassword = await bcrypt.hash(req.body.sifre, 10);
                    const sonuc = await User.findByIdAndUpdate(req.body.id, { sifre: hashedPassword });       //burada şifreyi güncelledikten sonra -forgot-pssword'e post işlemi yaptığımızda mail olarak gelen linke tıkladığımızda token hatası veriyor, çünkü şifre değişti token geçersiz artık (300.satırdaki hata mesajı)

                    if (sonuc) {
                        req.flash("success_message", [{ msg: 'Başarıyla şifre güncellendi' }]);
                        res.redirect('/login');
                    } else {
                        req.flash("error", 'Lütfen tekrar şifre sıfırlama adımlarını yapın');
                        res.redirect('/login');
                    }
                }
            });
        } catch (err) {
            console.log("hata cıktı" + err);
        }
    }
}

const logout = (req, res, next) => {
   
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_message', [{ msg: 'Başarıyla çıkış yapıldı' }]);
        res.redirect('/login');
      });
    
}

module.exports = {
    loginFormGoster,
    loginOl,
    forgetPasswordFormunuGoster,
    forgetPassword,
    yeniSifreFormuGoster,
    yeniSifreyiKaydet,
    logout
}
