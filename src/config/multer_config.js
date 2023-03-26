const multer = require('multer');
const path = require('path');

const myStorage = multer.diskStorage({                                         //multerin dosyaları nereye aktaracağı, yüklenenceği 
    destination: (req, file, cb) => {                                          //cb -callback function 
       
        cb(null, path.join(__dirname, "../uploads/avatars"));                  //çalışan dosyanın klasör adını bul ve ona "../uploads/avatars" bunu ekle -cb null hata yok demek için
    },                                                                         //_dirname = config ../ ile bununda bir üst klasörü olan src ye ulaştı oradan da uploads/avatars adresine geçti 

    filename: (req, file, cb) => {                                             //dosya adının ne olacağı 
      
        cb(null, req.user.email + "" + path.extname(file.originalname));       //(herkesin dosya adı farklı olsun diye) kullanıcının emaili + orginal dosya adının axtname alnıyla oluşturduk örnk:nuhaydd25@gmail.com.png
    }
});

const resimFileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {       //bizim için geçerli olan veri formatları
      
        cb(null, true);                                                        
    } else {
    
        cb(null, false);
    }
}

const uploadResim = multer({ storage: myStorage, fileFilter: resimFileFilter});   //yukarıdaki yapıları multere geçmek için oluşturuk

module.exports = uploadResim;