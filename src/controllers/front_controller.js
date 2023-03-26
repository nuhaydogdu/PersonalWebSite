const Blog = require('../model/blog_model');
const Category = require("../model/category_model");

const ozgecmisGoster = (req, res) => {
    res.render('resume', { layout: './layout/front_layout.ejs' })
}

const bloglarıGoster = async(req, res) => {

const  page=req.query.page || 1;                             //href="/?page=<%= i %>" index.ejs 84
const  blogsPerPage= 4;

const totalBlogs= await Blog.find().countDocuments();      //countDocuments(): sayfalama(pagination) için db deki dökümanların sayısını aldık              

const categories =await Category.find();


const bloglar = await Blog.find({})
.sort('-dateCreated')                                       //oluşturulma tahine göre sıralıyor 
.skip((page-1)*blogsPerPage)                               //hangi sayfada olduğumuza göre kaç tane foto atlayacağımızı belirledik
.limit(blogsPerPage)                                       //her sayfada kaç tane gösterileceğini belirledik
  
res.render('blogs',{
  layout: './layout/front_layout.ejs',
  bloglar:bloglar,
  current:page,                                           //o anki sayfa 
  pages:Math.ceil(totalBlogs/blogsPerPage),              //toplam sayfa sayısı -Math.ceil küsürlü ifadeleri üste yuvarlıyor

  categories
})

};

const blogGoster  = async(req, res) => {
    const blog = await Blog.findOne({slug:req.params.slug});
    console.log(blog);
    res.render('blog', { 
        layout: './layout/front_layout.ejs',
        blog
     })
}



module.exports = {
    ozgecmisGoster,
    bloglarıGoster,
    blogGoster,
 
}