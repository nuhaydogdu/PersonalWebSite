const Blog = require("../model/blog_model")
const Category = require("../model/category_model")

const adminPanelGoster=  (req, res) => {
    res.render('content', { layout: './layout/admin_layout.ejs' })
}

const profilSayfasiniGoster=  (req, res) => {
    res.render('profil', { layout: './layout/admin_layout.ejs' })
}

const profilGuncelle = async function (req, res, next) {
    
    const guncelBilgiler = {
        ad: req.body.ad,                                   //veri tabanındaki ad - req.body(.ad)  formdan gelen ad değeri
        soyad:req.body.soyad
    }

   
    try {                                                        //nasılki passwordlocal requestimize bir user veriyordu. multer de o an upload edilen file ile ilgili bilgileri içern yapı veriyor(req.file)
        if (req.file) {                                          //kullanıcının resim seçip seçmeme durumuna göre guncelBilgileri dolduruyoruz
            guncelBilgiler.avatar = req.file.filename;                           
        }

        const sonuc = await User.findByIdAndUpdate(req.user.id, guncelBilgiler);   
        
        if (sonuc) {
            console.log("update tamamlandı");
            res.redirect('/admin/profil');             //eğer redirect yerine render kullanırsak linkimiz değişmiyor
        }

       
    } catch (hata) {
        console.log(hata);
    }
    
}


const getAddBlog=  (req, res) => {
    res.render('add_blog', { layout: './layout/admin_layout.ejs' })
}

const postAddBlog= async (req, res) => {

    // console.log(req.body);
    // console.log(req.files[0].filename);

    const eklenecekBilgiler = {
        title: req.body.title,                                   //veri tabanındaki ad - req.body(.ad)  formdan gelen ad değeri
        description: req.body.description
    }


    if (req.files) {                                          //kullanıcının resim seçip seçmeme durumuna göre guncelBilgileri dolduruyoruz
        eklenecekBilgiler.image = req.files[0].filename;                           
    }

    const blog = await Blog.create(eklenecekBilgiler);
    // const categorie = await Category.create({category: req.body.category});
     
    req.flash('success_message', [{ msg: "taslak başarıyla kaydedildi"}]);
    res.redirect('add-blog');

}


module.exports={
    adminPanelGoster,
    profilSayfasiniGoster,
    profilGuncelle,
    getAddBlog,
    postAddBlog,

}