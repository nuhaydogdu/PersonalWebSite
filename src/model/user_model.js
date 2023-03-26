const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    ad: {
        type: String,
        trim: true,
        required: true,
    },
    soyad: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    sifre: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        default:'nuhaydd25@gmail.com.jpeg' 
    }

}, { collection: 'kullanicilar'});

const User = mongoose.model('User', UserSchema);

module.exports = User;