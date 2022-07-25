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





router.get('/signin', async (req, res, next) => {
  try {
    const user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
    profileSchema.countDocuments({userId: user.id}, async function (err, cnt){ 
      if (err) {
        console.log(err)
      }
      if(cnt == 0) {
        res.render('signin')
      }
      else {
        res.redirect('/')
      }
    })
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
      res.redirect('/signin')
    }
  }catch(error) {
    console.log(error)
    res.redirect('/logout')
  }
});





router.post('/profile', async (req, res, next) => {
  try {
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
    res.redirect('/profile')
  }catch(error) {
    console.log(error)
    res.redirect('/logout')
  }
})




router.post('/signin', async (req, res, next) => {
  try {
    const user = await oauth.getUser(jwt.verify(req.cookies.get('key'), process.env.jwtSecret))
    profileSchema.countDocuments({userId: user.id}, async function (err, cnt){ 
      if (err) {
        console.log(err)
      }
      if(cnt == 0) {
        await new profileSchema({
          userId: user.id,
          octaCreds: 0,
          wallet: req.body.wallet,
          name: req.body.name,
          gender: req.body.gender,
          country: req.body.country,
          zipCode: req.body.zip,
          houseNumber: req.body.house,
          city: req.body.city,
          streetName: req.body.street,
        }).save()
      }
      else {
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
      }
    })
    res.redirect('/')
  }catch(error) {
    console.log(error)
    res.redirect('/logout')
  }
})





module.exports = router;