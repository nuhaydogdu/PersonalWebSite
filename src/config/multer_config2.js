const multer = require('multer');
const path = require('path');

const myStorage = multer.diskStorage({                                         //multerin dosyaları nereye aktaracağı, yüklenenceği 
    destination: (req, file, cb) => {                                          //cb -callback function 
       
        cb(null, path.join(__dirname, "../uploads/images"));                  //çalışan dosyanın klasör adını bul ve ona "../uploads/avatars" bunu ekle -cb null hata yok demek için
    },                                                                         //_dirname = config ../ ile bununda bir üst klasörü olan src ye ulaştı oradan da uploads/avatars adresine geçti 

    filename: (req, file, cb) => {                                             //dosya adının ne olacağı 
       
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  
    }
});


const resimFileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {       //bizim için geçerli olan veri formatları
      
        cb(null, true);                                                        
    } else {
    
        cb(null, false);
    }
}

const loadImage = multer({ storage: myStorage, fileFilter: resimFileFilter});   //yukarıdaki yapıları multere geçmek için oluşturuk

module.exports = loadImage;