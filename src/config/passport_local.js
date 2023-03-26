//pasporttaki bütün giriş çıkış işkemleriyle ilgili sıtratejilerden biz burada email ve şifreyle giriş stratejisini ele alıyoruz(passport-local).
//veri tabanınıa newUseri kaydettik ama bu kullanıcının othentice olması yani giriş işlemleri hep passportjs de olacak -hatta passport js de local isimli kurduğumuz paket sayesinde olacak (passport-local email ve sifre ile girişte kullalnılıyor )
//passportlocal requestimize user veriyor!!!!!!

const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user_model');                                         //user tablomuza da ihtiyacımız var kontrol işleleri için
const bcrypt = require('bcrypt');

module.exports = function (passport) {                                               //bu fonksiyonu çağırdığımızda dışarıdan bir passport nesnesi gelmeli
   
    const options = {
        usernameField: 'email',                                                      //login.ejs de kendi tanımladığımız name alanlarına göre adlandırıyoruz
        passwordField: 'sifre'
    };

    passport.use(new LocalStrategy(options, async (email, sifre, done) => {          //passportjs olarak passportlocal(LocalStrategy) kullanacağımızı belirtiyoruz.(email, sifre, done) buradaki değerlerle kontrollerimiz olacak, (done)callback
        
        try {
            const _bulunanUser = await User.findOne({ email: email });

            if (!_bulunanUser) {
                return done(null, false, { message: 'User bulunamadı' });            //null:hata olmadığı için, false: kullanıcı bulunamadığı için, mesaj yazacaksak { message:""}  
            }                                                                        //burada atamış olduğumuz message değerleri req.flash içerisinde error diye bir dizinin içerisine otamatik olarak eklekniyor

            const sifreKontrol = await bcrypt.compare(sifre, _bulunanUser.sifre);   //girilen şifre ve veritabanımızda bulunan hashkenmiş şifre yi karşılaştırdık
            if (!sifreKontrol) {
                return done(null, false, { message: 'Şifre hatalı' });
            } else {
                    return done(null, _bulunanUser);                                 //en sonunda hata çıkmazsa bulunan useri gönderiyoruz artık bu kullanalılabilir 
            }
            
        } catch (err) {
            return done(err);                                                //burada da sedece hatayı gönderiyoruz
        }
    }));


    passport.serializeUser(function (user, done) {                           //-serializeUser Bulunan userin (session)cokie'de id değerinin saklanması için!!!
 
        done(null, user.id);
      });
      
    passport.deserializeUser(function (id, done) {                           //-deserializeUser ise (session)cokie'den okunan id değerin kullanıcı tablosunda tekaradan bulunması ve kullanıcının geriye döndürülmesi işlemkerlni ele alıyor
       
        User.findById(id, function (err, user) {                             //bu alandaki değerleri req.user in içerisine atmış oluyoruz
            const yeniUser = {                                               //sayfalarda ihtiyacımız olan değerler burada tutuluyor
                id:user.id,
                email: user.email,
                ad: user.ad,
                soyad:user.soyad,
                avatar:user.avatar
          }
          done(err, yeniUser);
        });
      });

}