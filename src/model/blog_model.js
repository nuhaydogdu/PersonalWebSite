const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require('slugify');


const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      unique: true
    },
    // category:{                                            //Course modeli ve Category modeli arasında ilişki kurmak için
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:'Category'
    // }
  },
  { collection: "bloglar" }
);

BlogSchema.pre('validate', function(next){      //Sırada ise modelimizdeki hangi alandan slug oluşturacağız, onu belirtmemiz gerekir. Biz kendi çalışmamızda name alanından oluşturacağız.
  this.slug = slugify(this.title, {
    lower:true,                                    //lowarcase
    strict:true                                   //string türünde olması içi yabancı işaretleri boşlukları düzeltiyor
  })
  next();
})

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
