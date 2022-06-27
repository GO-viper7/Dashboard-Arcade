const path = require('path');
require("dotenv").config();
const express = require('express');
const fs = require('fs')
const rootDir = require('../util/path');
const adminData = require('./admin');
const router = express.Router();
const users = require('../users.json')
const jwt = require('jsonwebtoken')


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



const { connect } = require('mongoose');
connect(process.env.mongoPath, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Database connected');
});

const profileSchema = require('../schemas/profile-schema');
const inventorySchema = require('../schemas/inv-schema');
const itemSchema = require('../schemas/item-schema');
const productSchema = require('../schemas/product-schema');
const { profile } = require('console');
const { UserCollection } = require('disco-oauth/lib/types');








router.get('/', async (req, res, next) => {

  if (req.cookies.get('first') == undefined) {
    
    res.cookie("cat", `cat`, {httpOnly: false, overwrite: true})
    res.cookies.set("first", 'permanent')
  }
  
  let cookies = req.cookies.get('key')
  if (cookies) {
    let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
    var o = 0;
    var invi = []
    const result = await inventorySchema.findOne({
          userId: user.id
      })

      let invis = []
      if (result) {
          invis = result.Inventory
      } else {
         
          await new inventorySchema({
              userId : user.id,
              Inventory : invis
          }).save()
      }
    
    profileSchema.findOne({userId: user.id}, async (err, data) => {
      if (data) {
        o = data.OctaCreds
      }
      if (req.cookies.get('cat') == undefined) {
        var result = await  productSchema.find({})
        //console.log(result)
        k = result.filter(x => x.category == x.category)
      }
      else { 
        var result = await  productSchema.find({})
        //console.log(result)
        k = result.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) )
      }
      return res.render('shop', {prod: k, user: user.username, id : user.id, url: url, coins: o, bool: '', ids: users, inv : invis})
  })
  
  }
  else {
    if (req.cookies.get('cat') == undefined) {
      var result = await  productSchema.find({})
      //console.log(result)
      k = result.filter(x => x.category == x.category)
    }
    else  {
      var result = await  productSchema.find({})
      //console.log(result)
      k = result.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) ) 
    }
    return res.render('shop', {prod: k,  url: url, user: '', coins: '', bool: '', inv: ''})
  }

});





router.post('/', async (req, res, next) => {
 // console.log( req.body)
  let cookies = req.cookies.get('key')
  if (cookies) {
    
    let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
    var o = 0;
    if ( req.body.red == true) {
      console.log('goin to red')
      profileSchema.findOneAndUpdate({userId: user.id}, {OctaCreds : req.body.cost}, null, async (err, data) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(data)
        }
      })
      productSchema.findOneAndUpdate({id: req.body.id}, {stock : req.body.stock-1}, null, async (err, data) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(data)
        }
      })
      await new itemSchema({
          id: req.body.id,
          userId: user.id,
          name: req.body.name,
          url: req.body.url, 
          category: req.body.category
      }).save()
  }
}
});











module.exports = router;
