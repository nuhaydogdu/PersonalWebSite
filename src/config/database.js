const mongoose= require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,                              
}) 
.then(()=> console.log("veri tabanına bağlanıldı"))
.catch(hata=> console.log(`veri tabanına bağlanırken hata çıktı ${hata}`))
