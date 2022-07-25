const { Router } = require("express");
const productSchema = require('../schemas/product-schema');
const categorySchema = require('../schemas/category-schema');
const {
  getAdminProfile, getAdminCategory , getAdmin, getAdminProduct
} = require("../controllers/adminController");
const router = Router();
const multer  = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
const fileFilter=(req, file, cb)=>{
   if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
       cb(null,true);
   }else{
       cb(null, false);
   }
}
const upload = multer({ 
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });
 



router.get('/add-product', getAdminProfile, getAdminCategory, getAdmin, getAdminProduct);


router.post('/add-product', upload.single('file'),  async (req, res, next) => {
  if (req.body.del == true) {
    productSchema.countDocuments({}, async function (err, count){ 
      await productSchema.deleteOne({ id: req.body.id })
        let tr = 0
        let result = await productSchema.find({}) 
        result.forEach((x) => {
            tr++
            productSchema.findOneAndUpdate({id: x.id}, {id: tr} , null, async (err, data) => {
            if (err) {
              console.log(err)
            }
            else {
              //console.log(data)
            }
          }) 
        })
      });
   return;
  }
  if ( req.body.edit == true ) {
    productSchema.findOneAndUpdate({id: req.body.id}, {
    cost : Number(req.body.cost),
    stock : Number(req.body.stock),
    name : req.body.name.trim(),
    category : req.body.category.trim(),
    description : req.body.description.trim()
    }, null, async (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      //console.log(data)
    }
   })
   return 
  }
  if ( req.body.catEdit == true ) {
    await categorySchema.updateOne({categoryOne: req.body.oldCatOne}, {categoryOne: req.body.oneName.trim()})
    await categorySchema.updateOne({categoryTwo: req.body.oldCatTwo}, {categoryTwo: req.body.twoName.trim()})
    await categorySchema.updateOne({categoryThree: req.body.oldCatThree}, {categoryThree: req.body.threeName.trim()})
    await productSchema.updateMany({category: req.body.oldCatOne}, {category : req.body.oneName.trim() })
    await productSchema.updateMany({category: req.body.oldCatTwo}, {category : req.body.twoName.trim() })
    await productSchema.updateMany({category: req.body.oldCatThree}, {category : req.body.threeName.trim() })
    return 
  }

  if ( req.file == undefined) {
    throw new Error('No Image selected')
  }
  productSchema.countDocuments({}, async function (err, cnt){ 
    if (err) {
      console.log(err)
    }

    productSchema.countDocuments({name: req.body.name, category: req.body.cat}, async (err, count) => {
      if (count == 0) {
        await new productSchema({
          id : Number(cnt)+1,
          description : req.body.desc.trim(),
          cost : Number(req.body.cost),
          stock : Number(req.body.stock),
          name : req.body.name.trim(),
          category : req.body.cat.trim(),
          url : req.file.filename,
          premium : req.body.premium!==undefined ? req.body.premium : false
          }).save()
      }
    })
  }); 
});


module.exports = {
  router: router
}