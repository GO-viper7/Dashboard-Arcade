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



const getAdminProfile = async (req, res, next) => {
  let cookies = req.cookies.get('key')
  if (cookies == undefined) {
    return res.redirect('/')
  }
  next()
}


const getAdminCategory = async (req, res, next) => {
    let result1 = await categorySchema.find({})
    if (result1.length == 0) {
      await new categorySchema({
        categoryOne: 'cat1',
        categoryTwo: 'cat2',
        categoryThree: 'cat3',
        flag: 1
      }).save()
    }
    next()
}



const getAdmin = async (req, res, next) => {
   try {
      let user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
      users.forEach(x => {
        if (x.userId == user.id) {
          next()
        } 
      })
      // return res.redirect('/')
   }catch (error) {
     console.log(error)
     return res.redirect('/logout')
   }

}



const getAdminProduct = async (req, res, next) => {
  try {
    let result = await  productSchema.find({})
    let result1 = await categorySchema.find({})
    return res.render('add-product', {prod: result, cats: result1, products: JSON.stringify(result)});
  }catch (error) {
    console.log(error)
    return res.redirect('/logout')
  }
}
    
 

module.exports = {
  getAdminProfile, getAdminCategory, getAdmin, getAdminProduct
}
