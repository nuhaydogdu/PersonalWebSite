const router = require('express').Router();
const authController = require('../controllers/auth_controller')
const frontController = require('../controllers/front_controller')
const validatorMiddleware = require('../middlewares/validation_middleware');
const authMiddleware = require('../middlewares/auth_middleware');

router.get('/resume', frontController.ozgecmisGoster)
router.get('/blogs', frontController.bloglarıGoster)
router.get('/blogs/:slug', frontController.blogGoster)


router.get('/login',authMiddleware.oturumAcilmamis,authController.loginFormGoster);
router.post('/login',authMiddleware.oturumAcilmamis, validatorMiddleware.validateUser(), authController.loginOl);

router.get('/forget-password',authMiddleware.oturumAcilmamis,authController.forgetPasswordFormunuGoster);
router.post('/forget-password',authMiddleware.oturumAcilmamis, validatorMiddleware.validateEmail(), authController.forgetPassword);

router.get('/reset-password/:id/:token', authController.yeniSifreFormuGoster);
router.post('/reset-password', validatorMiddleware.validateNewPassword(), authController.yeniSifreyiKaydet);

router.get('/logout', authMiddleware.oturumAcilmis, authController.logout);  



module.exports = router;