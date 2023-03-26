const { body } = require('express-validator');       //validation işlemleri axpress middleWare olan express-validator ile yapılıyor


const validateUser = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Please enter a valid e-mail'),

        body('sifre').trim()
            .isLength({ min: 6 }).withMessage('The password should be 6 characters at least')
            .isLength({ max: 20 }).withMessage('Password must be a maximum of 20 characters'),
    ];
}

const validateEmail = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Please enter a valid e-mail'),
    ];
}

const validateNewPassword = () => {
    return [
       

        body('sifre').trim()
            .isLength({ min: 6 }).withMessage('The password should be 6 characters at least')
            .isLength({ max: 20 }).withMessage('Password must be a maximum of 20 characters'),

        body('resifre').trim().custom((value, { req }) => {
            if (value !== req.body.sifre) { 
                throw new Error('Passwords are not the same');
            }
            return true;
        })
    ];
}



module.exports = {
    validateUser,
    validateEmail,
    validateNewPassword
    
}