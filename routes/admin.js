const { Router } = require("express");
const productSchema = require('../schemas/product-schema');
const categorySchema = require('../schemas/category-schema');
const {
  getAdminProfile, getAdminCategory , getAdmin, getAdminProduct
} = require("../controllers/adminController");
const router = Router();
const multer  = require('multer');
require("dotenv").config();
const express = require('express');
const chalk = require('chalk');
const crypto = require("crypto");
const users = require('../admins.json')
const mails = require('../mailIds.json')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: `${process.env.websiteURL}/discord`,
});
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.mailId,
      pass: process.env.mailPassword
  }
});
const profileSchema = require('../schemas/profile-schema');
const itemSchema = require('../schemas/item-schema');


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


router.post('/', upload.single('file'),  async (req, res, next) => {
  
  try {
    if ( req.body.red == true) {
      console.log("went to red")
      let user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
      itemSchema.countDocuments({userId: user.id, premium: true, category: req.body.category, itemName: req.body.name}, async (err, count) => {
        if (err) {
          console.log(err)
        }
        if (count > 0) {
        return res.redirect('/')
        }
        else {
          try {
            console.log('went to fk')
            let user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
            profileSchema.findOneAndUpdate({userId: user.id}, {OctaCreds : req.body.cost}, null, async (err, data) => {
              if (err) {
                console.log(err)
              }
            })
            productSchema.findOneAndUpdate({id: req.body.id}, {stock : req.body.stock-1}, null, async (err, data) => {
              if (err) {
                console.log(err)
              }
            })
            let arr = await profileSchema.findOne({userId: user.id})
            const date = new Date()
            let hexId = crypto.randomBytes(4).toString("hex")
            // while(itemSchema.findOne({orderId: hexId}) != undefined) {
            //   hexId = crypto.randomBytes(4).toString("hex")
            // } 
            await new itemSchema({
                id: req.body.id,
                userId: user.id,
                userAvatar: user.avatar,
                orderId: hexId,
                date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
                userName: `${user.username}#${user.discriminator}`,
                cost: req.body.cost,
                itemName: req.body.name.trim(),
                url: req.body.url, 
                category: req.body.category.trim(),
                premium: req.body.premium!==undefined ? req.body.premium : false,
                order: false,
                wallet: arr.wallet,
                name: arr.name,
                gender: arr.gender,
                country: arr.country,
                zipCode: arr.zipCode,
                houseNumber: arr.houseNumber,
                city: arr.city,
                streetName: arr.streetName
            }).save()
          }catch (err) {
            console.log(err)
            return res.redirect('/logout')
          }
          try{
            const mailList = []
            mails.forEach(mail => {
              mailList.push(mail.mailId)
            })
            const discordUser = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
            const mailOptions = {
              from: `"${process.env.mailAuthor}" ${process.env.mailId}`,
              to: mailList, 
              subject: 'Purchase from Marketplace', 
              text: req.body.body, 
              html: `<b> ${discordUser.username}#${discordUser.discriminator} purchased ${req.body.name} worth of ${req.body.realCost} coins</b>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw new Error('Error in sending mail')
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
          }catch (err) {
            console.log(err)
            return res.redirect('/logout')
          }
        }
      })
    }
  }catch (err) {
    console.log(err)
    return res.redirect('/logout')
  }
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
    console.log('went to edit')
    console.log(req.body)
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
  console.log(req.body)
  if ( req.file == undefined) {
    return
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
          premium : req.body.premium!==undefined ? true : false
          }).save()
      }
    })
  }); 
  return res.redirect('/')
});


module.exports = {
  router: router
}