const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const itemSchema = require('../schemas/item-schema');
const DiscordOauth2 = require("discord-oauth2");
require("dotenv").config();
const jwt = require('jsonwebtoken')
const oauth = new DiscordOauth2({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: `${process.env.websiteURL}/discord`,
});
const categorySchema = require('../schemas/category-schema');
const profileSchema = require('../schemas/profile-schema')

router.get('/inventory', async (req, res, next) => {
  let p
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
  var result = await  itemSchema.find({userId: user.id})
  let fill = req.cookies.get('fill')
  if (result.length == 0) {
  return res.render('inventory', {filled: "false", prod: [], bool: false, user: '', cats: await categorySchema.find({})});
  }
  if (req.cookies.get('inv-cat') == undefined) {
    k = result.filter(x => x.category == x.category)
    p = k.filter(q => q.order == (`${req.cookies.get('fill')}` == 'false' ? false : true))
  }
  else  {
    k = result.filter(x => x.category == (`${req.cookies.get('inv-cat')}` == 'cat' ? x.category : `${req.cookies.get('inv-cat')}`) )
    p = k.filter(q => q.order == (`${req.cookies.get('fill')}` === 'false' ? false : true))
  }
  res.render('inventory', {profile: await profileSchema.findOne({userId: user.id}), filled: fill,prod: p, bool: true, user: user, cats: await categorySchema.find({})});
});

router.get('/admin/orders', async (req, res, next) => {
  let l
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
  let result = await itemSchema.find({})
  res.render('orders', {prod: result, bool: true, user: user});
})


router.post('/admin/orders', async (req, res, next) => {
  itemSchema.findOneAndUpdate({orderId: req.body.orderId}, {$set: {order: req.body.fill == "filled" ? true : false}}, function(err, doc) {
    if(err) {
      console.log(err.message)
    }
    res.redirect('/admin/add-product/orders')
  })
})

module.exports = router;