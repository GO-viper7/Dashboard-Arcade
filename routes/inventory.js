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
const profileSchema = require('../schemas/profile-schema');
const notificationSchema = require('../schemas/notification-schema')

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
    k = result
    p = k
  }
  else  {
    k = result
    p = k
  }
  const notifRes = await notificationSchema.find({userId: user.id})
  let notif = notifRes.reverse()
  res.render('inventory', {profile: await profileSchema.findOne({userId: user.id}), filled: fill,prod: p, bool: true, user: user, cats: await categorySchema.find({}), notifs: notif});
});

router.get('/admin/orders', async (req, res, next) => {
  let l
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
  let result = await itemSchema.find({order: false})
  let revRes = result.reverse()
  res.render('orders', {prod: revRes, bool: true, user: user, title: 'Pending Orders'});
})

router.get('/admin/orders/fulfil', async (req, res, next) => {
  let l
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
  let result = await itemSchema.find({order: true})
  let revRes = result.reverse()
  res.render('orders', {prod: revRes, bool: true, user: user, title: 'FulFilled Orders'});
})


router.post('/admin/orders', async (req, res, next) => {
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(jwt.verify(cookies, process.env.jwtSecret))
  let result  = await itemSchema.findOne({orderId: req.body.orderId})
  if(req.body.status == "true") {
    await new notificationSchema({
        userId: user.id,
        notification: `Your order for ${result.itemName} under ${result.category} has been fulfilled`,
        time: Date.now()
    }).save()
    itemSchema.findOne({orderId: `${req.body.orderId}`}, async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc)
        doc.order = true
        doc.save()
      }
    })
  }
  else if (req.body.status == "false") {  
    await new notificationSchema({
        userId: user.id,
        notification: `Your order for ${result.itemName} under ${result.category} has been queued for pending`,
        time: Date.now()
    }).save()
    itemSchema.findOne({orderId: `${req.body.orderId}`}, async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc)
        doc.order = false
        doc.save()
      }
    })
  }

})

module.exports = router;