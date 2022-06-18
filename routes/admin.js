const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const productSchema = require('../schemas/product-schema');
const users = require('../users.json')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: "978339805496750150",
	clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
	redirectUri: "https://dashboard-77.herokuapp.com/discord",
});







var multer  = require('multer');
 
var storage = multer.diskStorage({
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
 
var upload = multer({ 
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });
 








// /admin/add-product => GET
router.get('/add-product', async (req, res, next) => {
  let cookies = req.cookies.get('key')
  
  if (cookies) {
    var result = await  productSchema.find({})
    //console.log(result)
    let user = await oauth.getUser(cookies)
    users.forEach(x => {
      
      if (x.userId == user.id) {
        return res.render('add-product', {prod: result});
      }
         
    })
    //return res.redirect('/')
  }
  else {
    return res.redirect('/')
  }
  
    
});

router.post('/add-product', upload.single('file'),  async (req, res, next) => {
  console.log(req.body)
  if (req.body.del == true) {
    productSchema.countDocuments({}, async function (err, count){ 
      await productSchema.deleteOne({ id: req.body.id })
        var tr = 0
        var result = await productSchema.find({}) 
        result.forEach((x) => {
            tr++
            productSchema.findOneAndUpdate({id: x.id}, {id: tr} , null, async (err, data) => {
            if (err) {
              console.log(err)
            }
            else {
              console.log(data)
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
    name : req.body.name,
    category : req.body.category
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
 console.log(req.file)
    if ( req.file == undefined) {
      return;
    }
    productSchema.countDocuments({}, async function (err, count){ 
      console.log(count)
    if (err) {
      console.log(err)
    }
    var k ;
    if (req.body.cat)
    await new productSchema({
      id : Number(count)+1,
      cost : Number(req.body.cost),
      stock : Number(req.body.stock),
      name : req.body.name,
      category : req.body.cat,
      url : req.file.filename
    }).save()
  }); 
  return;
});

// /admin/add-product => POST


exports.routes = router;
