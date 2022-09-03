require("dotenv").config();
const express = require('express');
const chalk = require('chalk');
const router = express.Router();
const crypto = require("crypto");
const users = require('../admins.json')
const mails = require('../mailIds.json')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const categorySchema = require('../schemas/category-schema');
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
const productSchema = require('../schemas/product-schema');








const getCat = async (req, res, next) => {
  let result = await categorySchema.find({})
  if (result.length == 0) {
    await new categorySchema({
      categoryOne: 'cat1',
      categoryTwo: 'cat2',
      categoryThree: 'cat3',
      flag: 1
    }).save()
  }
  next()
}


const getFirst = async (req, res, next) => {
  if (req.cookies.get('first') == undefined) {
    res.cookie("cat", `cat`, {httpOnly: false, overwrite: true})
    res.cookie("fill", false , {httpOnly: false, overwrite: true})
    res.cookie("inv-cat", 'cat' , {httpOnly: false, overwrite: true})
    res.cookies.set("first", 'permanent')
  }
  next()
}


const chooseCat = async (req, res, next) => {
  let result = await  productSchema.find({})
  if (req.cookies.get('cat') == undefined) 
    k = result.filter(x => x.category == x.category)
  else 
    k = result.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) )
  req.products = k
  next()
}

const getProfile = async (req, res, next) => {
  let cookies = req.cookies.get('key')
  let result = await categorySchema.find({})
  if (cookies == undefined) {
    return res.status(200).render('shop', {prod: req.products, prof: '',  url: process.env.discordURI, user: '', coins: '', bool: '', inv: '', cats: result, unique: '', products: ''})
  }
  else {
    next()
  }
}


const getVerified = async (req, res, next) => {
    try {
      let result = await categorySchema.find({})
      let uniquePremItems=[];
      let user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
      itemSchema.find({userId: user.id, premium: true}, (err, data) => {
        if (err) {
          console.log(err)
        }
        data.forEach(g => {
            uniquePremItems.push({name: g.itemName, category: g.category})
        })
      })
      const coins = profileSchema.findOne({userId: user.id}, async (err, data) => {
        if (err) {
          console.log(err)
        }
        if (data == null) {
          return res.redirect('/logout')
        }
        else {
          return res.render('shop', {prod: req.products, user: user, id : user.id, url: process.env.discordURI, coins: data.OctaCreds, prof: JSON.stringify(data),  bool: '', ids: users,  cats: result, unique: JSON.stringify(uniquePremItems), products: JSON.stringify(req.products)})
        }
      })
    }catch (err) {
      console.log(err)
      return res.redirect('/logout')
    }
};







const checkUnique = async (req, res, next) => {
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
         next()
        }
      })
    }
  }catch (err) {
    console.log(err)
    return res.redirect('/logout')
  }
  next()
  
}
   


const sendMail = async (req, res, next) => {
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



const buyProduct = async (req, res, next) => {
  try {
    console.log('went to buy')
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
    await new itemSchema({
        id: req.body.id,
        userId: user.id,
        orderId: crypto.randomBytes(10).toString("hex"),
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
  next()
}


module.exports = {
  getCat,buyProduct,sendMail,checkUnique,getVerified,getProfile,chooseCat,getFirst
};
