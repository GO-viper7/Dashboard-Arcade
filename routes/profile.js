const express = require('express');
const router = express.Router();
const profileSchema = require('../schemas/profile-schema');
const DiscordOauth2 = require("discord-oauth2");
require("dotenv").config();
const jwt = require('jsonwebtoken')
const oauth = new DiscordOauth2({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: `${process.env.websiteURL}/discord`,
});





router.get('/settings', async (req, res, next) => {
  try {
    const user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
    res.render('settings', {user: user, profile: await profileSchema.findOne({userId: user.id})})
  }catch(err) {
    console.log(err)
    return res.redirect('/logout')
  }
})




router.get('/logout', async (req, res, next) => {
  res.clearCookie('key')
  res.redirect('/')
})






router.get('/profile', async (req, res, next) => {
  try {
    const user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
    if (req.cookies.get('key')) {
      res.render('profile', {
        user: user, 
        profile: await profileSchema.findOne({userId: user.id})
      });
    }
    else {
      res.redirect('/settings')
    }
  }catch(error) {
    console.log(error)
    res.redirect('/logout')
  }
});





router.post('/settings', async (req, res, next) => {
  try {
    console.log(req.body)
    const user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
    profileSchema.findOneAndUpdate({userId: user.id}, {
      wallet: req.body.wallet,
      name: req.body.name,
      gender: req.body.gender,
      country: req.body.country,
      zipCode: req.body.zip,
      houseNumber: req.body.house,
      city: req.body.city,
      streetName: req.body.street,
    }, null, async (err, data) => {
      if (err) {
        console.log(err)
      }
      else {
        //console.log(data)
      }
    })
    res.redirect('/settings')
  }catch(error) {
    console.log(error)
    res.redirect('/logout')
  }
})




module.exports = router;