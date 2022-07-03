const path = require('path');
require("dotenv").config();
const express = require('express');
const fs = require('fs')
const rootDir = require('../util/path');
const adminData = require('./admin');
const router = express.Router();
const users = require('../admins.json')
const mails = require('../mailIds.json')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const categorySchema = require('../schemas/category-schema');
const crypto = require('crypto')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: "https://dashboard-77.herokuapp.com/discord",
});

const url = oauth.generateAuthUrl({
	scope: ["identify", "guilds"],
	state: crypto.randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
});

const mailList = []
mails.forEach(mail => {
  mailList.push(mail.mailId)
})


const profileSchema = require('../schemas/profile-schema');
const inventorySchema = require('../schemas/inv-schema');
const itemSchema = require('../schemas/item-schema');
const productSchema = require('../schemas/product-schema');
const { UserCollection } = require('disco-oauth/lib/types');








router.get('/', async (req, res, next) => {
  var result1 = await categorySchema.find({})
  if (result1.length == 0) {
    await new categorySchema({
      categoryOne: 'cat1',
      categoryTwo: 'cat2',
      categoryThree: 'cat3',
      flag: 1
    }).save()
  }
  if (req.cookies.get('first') == undefined) {
    
    res.cookie("cat", `cat`, {httpOnly: false, overwrite: true})
    res.cookies.set("first", 'permanent')
  }
  
  let cookies = req.cookies.get('key')
  if (cookies != undefined) {
    try {
      var uniqueItems=[];
      let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
    itemSchema.find({userId: user.id, premium: true}, (err, data) => {
       data.forEach(g => {
          uniqueItems.push({id: g.id, name: g.name})
       })
    })
    var o = 0;
    
    profileSchema.findOne({userId: user.id}, async (err, data) => {
      if (data) {
        o = data.OctaCreds
      }
      if (req.cookies.get('cat') == undefined) {
        var result = await  productSchema.find({})
      
        k = result.filter(x => x.category == x.category)
      }
      else { 
        var result = await  productSchema.find({})
     
        k = result.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) )
      }
      return res.render('shop', {prod: k, user: user.username, id : user.id, url: url, coins: o, bool: '', ids: users,  cats: result1, unique: JSON.stringify(uniqueItems)})
  })
}catch (err) {
  console.log(err)
}
  
  }
  else {
    if (req.cookies.get('cat') == undefined) {
      var result = await  productSchema.find({})
    
      k = result.filter(x => x.category == x.category)
    }
    else  {
      var result = await  productSchema.find({})
     
      k = result.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) ) 
    }
    return res.render('shop', {prod: k,  url: url, user: '', coins: '', bool: '', inv: '', cats: result1})
  }

});




router.post('/', async (req, res, next) => {
  
  let cookies = req.cookies.get('key')
  if (cookies) {
    
    let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
    let discordUser = user
    var o = 0;
    if ( req.body.red == true) {
     

      itemSchema.countDocuments({userId: user.id, premium: true, id: req.body.id, name: req.body.name}, async (err, count) => {
     
         if (count > 0) {
          return res.redirect('/')
         }
         else {
            let transporter = nodeMailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                  user: 'nithishbanda2021@gmail.com',
                  pass: 'uivrkjacwnpzvoop'
              }
          });
          let mailOptions = {
              from: '"Marketplace" <nithishbanda2021@gmail.com>',
              to: mailList, 
              subject: 'Purchase from Marketplace', 
              text: req.body.body, 
              html: `<b> ${discordUser.username}#${discordUser.discriminator} purchased ${req.body.name} worth of ${req.body.realCost} coins</b>`
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
          });



          profileSchema.findOneAndUpdate({userId: user.id}, {OctaCreds : req.body.cost}, null, async (err, data) => {
            if (err) {
              console.log(err)
            }
            else {
              //console.log(data)
            }
          })
          productSchema.findOneAndUpdate({id: req.body.id}, {stock : req.body.stock-1}, null, async (err, data) => {
            if (err) {
              console.log(err)
            }
            else {
              //console.log(data)
            }
          })
          await new itemSchema({
              id: req.body.id,
              userId: user.id,
              name: req.body.name,
              url: req.body.url, 
              category: req.body.category,
              premium: req.body.premium!==undefined ? req.body.premium : false
          }).save()
        }
  })
  }
}
});











module.exports = router;
