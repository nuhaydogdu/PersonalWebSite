const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//TEMPLATE ENGİNE
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname, '/src/uploads')));    //buna isim vererekte kullanabilirim -"/uploads" bunu linklere eklediğimde bir istekte bulunduğumda direkt olarak (__dirname, '/src/uploads') bu adrese gitmiş oluyorum(src altındaki uploads src/upload) Exp: localhost:300/uploads/avatar/default.png
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

//DB
require('./src/config/database')

const MongoDBStore = require('connect-mongodb-session')(session);    //1-sessionları veri tabanında saklama işlemi için (connect-mongodb-session) paketi tanımlanıyor
const sessionStore = new MongoDBStore({                              //2-sessionları veri tabanında saklama işlemi yapılacak yer belirleniyor
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'sessionlar'
});


//MİDDLEWARE
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
//(session-middleware)
app.use(session(
    {                                                                
        secret: process.env.SESSION_SECRET,                          //sessiondaki id'nin saklanıp cokie olarak atanması için buraya rasgele bir sayı yazıyoruz (.env den aldık)
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24                    
        },
        store: sessionStore 
    }
));


app.use(flash());

app.use((req, res, next) => {                                         
    res.locals.validation_error = req.flash('validation_error');      
    res.locals.email = req.flash('email');
    res.locals.sifre = req.flash('sifre');
    res.locals.error_message = req.flash('error_message');     
    res.locals.success_message = req.flash('success_message');     

    res.locals.login_error = req.flash('error');   //passport_local içerisinde olası hatalrı burda yakalıyoruz

    next();
})

//passport initialize etme işlemleri burada gerçekleştiriliyor -session ve flash yapılarından sonra
//passport işlemlerinde genel olarak dokümasyona bakarak ilerliyoruz nasılsa öyle kullandık 
app.use(passport.initialize());
app.use(passport.session());


//ROUTERS
const authRouter = require('./src/routers/auth_router');
const adminRouter = require('./src/routers/admin_router');


app.get('/', (req, res) => { res.render('home', { layout: './layout/front_layout.ejs' }) })
app.use('/', authRouter);
app.use('/admin', adminRouter);


app.listen(process.env.PORT, () => {
    console.log(`server ${process.env.PORT} portundan ayaklandı`);
})
