const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const productSchema = require('../schemas/product-schema');
const categorySchema = require('../schemas/category-schema');
const users = require('../admins.json')
const DiscordOauth2 = require("discord-oauth2");
require("dotenv").config();
const oauth = new DiscordOauth2({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: `${process.env.websiteURL}/discord`,
});
const jwt = require('jsonwebtoken')






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
 





router.get('/add-product', async (req, res, next) => {
  let cookies = req.cookies.get('key')
  if (cookies) {
    var result = await  productSchema.find({})
    var result1 = await categorySchema.find({})
    if (result1.length == 0) {
      await new categorySchema({
        categoryOne: 'cat1',
        categoryTwo: 'cat2',
        categoryThree: 'cat3',
        flag: 1
      }).save()
    }
    result1 = await categorySchema.find({})
    let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
    users.forEach(x => {
      if (x.userId == user.id) {
        return res.render('add-product', {prod: result, cats: result1, products: JSON.stringify(result)});
      } 
    })
  }
  else {
    return res.redirect('/')
  }  
});






router.post('/add-product', upload.single('file'),  async (req, res, next) => {
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
    name : req.body.name,
    category : req.body.category,
    description : req.body.description
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
    await categorySchema.updateOne({categoryOne: req.body.oldCatOne}, {categoryOne: req.body.oneName})
    await categorySchema.updateOne({categoryTwo: req.body.oldCatTwo}, {categoryTwo: req.body.twoName})
    let res = await categorySchema.updateOne({categoryThree: req.body.oldCatThree}, {categoryThree: req.body.threeName})
    await productSchema.updateMany({category: req.body.oldCatOne}, {category : req.body.oneName })
    await productSchema.updateMany({category: req.body.oldCatTwo}, {category : req.body.twoName })
    res = await productSchema.updateMany({category: req.body.oldCatThree}, {category : req.body.threeName })
    return 
  }

  if ( req.file == undefined) {
    return;
  }
  productSchema.countDocuments({}, async function (err, cnt){ 
  if (err) {
    console.log(err)
  }
  var k ;

  productSchema.countDocuments({name: req.body.name, category: req.body.cat}, async (err, count) => {
     if (count == 0) {
      await new productSchema({
        id : Number(cnt)+1,
        description : req.body.desc,
        cost : Number(req.body.cost),
        stock : Number(req.body.stock),
        name : req.body.name,
        category : req.body.cat,
        url : req.file.filename,
        premium : req.body.premium!==undefined ? req.body.premium : false
        }).save()
     }
     else {
      //console.log('duplicate item detected')
     }
   })
  }); 
  return;
});



exports.routes = router;
