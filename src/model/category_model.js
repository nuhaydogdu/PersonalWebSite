const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');            //id alanımızı kullanrak  slag yapısını oluşturuyoruz (linkteki id görünümü hoş olmuyor onun yerine slag kullanıyoruz)

const CategorySchema = new Schema({
  category: {
    type: String,
    unique: true,
  },
  // slug1: {
  //   type: String,
  //   unique: true
  // }
});

// CategorySchema.pre('validation', function(next){      //Sırada ise modelimizdeki hangi alandan slug oluşturacağız, onu belirtmemiz gerekir. Biz kendi çalışmamızda name alanından oluşturacağız.
//   this.slug1 = slugify(this.category, {
//     lower:true,                                    //lowarcase
//     strict:true                                   //string türünde olması içi yabancı işaretleri boşlukları düzeltiyor
//   })
//   next();
// })

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;