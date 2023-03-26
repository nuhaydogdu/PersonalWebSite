const router = require('express').Router();
const adminController = require('../controllers/admin_controller')
const authMiddleware = require('../middlewares/auth_middleware');
const multerConfig = require('../config/multer_config');                  //GÖRSEL TÜKLEME İŞLEMLERİ İÇİN
const loadImage = require('../config/multer_config2');

router.get('/', authMiddleware.oturumAcilmis ,adminController.adminPanelGoster);

router.get('/profil', authMiddleware.oturumAcilmis, adminController.profilSayfasiniGoster);

router.post('/profil-guncelle', authMiddleware.oturumAcilmis, multerConfig.single('avatar'),  adminController.profilGuncelle);  
//multerConfig middleware ini ekliyoruz sonra multerin özelliği olan .single('avatar') çağırıp içerisine de formda beşirttiğimiz name değerini giriyoruz
//.single('avatar') -kullanıcı tekrardan bir pp seçse bile üzerine yazdığı için tek pp tutulacak

router.get('/add-blog', authMiddleware.oturumAcilmis ,adminController.getAddBlog);
router.post('/add-blog', authMiddleware.oturumAcilmis, loadImage.array('image', 50), adminController.postAddBlog);



module.exports = router;