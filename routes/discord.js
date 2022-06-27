const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const crypto = require('crypto')
const DiscordOauth2 = require("discord-oauth2");
const Cookies = require('cookies');
const oauth = new DiscordOauth2();
require("dotenv").config({path: '../config.env'});
const jwt = require('jsonwebtoken')
router.get('/discord', async  (req, res) => {
 
   let code = req.query.code;
   if( code == undefined) {
     res.send('Auth code is undefined')
   }
   else {
  
    let data = await oauth.tokenRequest({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      code: code,
      scope: "identify guilds",
      grantType: "authorization_code",
      redirectUri: "https://dashboard-77.herokuapp.com/discord",
    })
     
     res.cookies.set("key", jwt.sign(data.access_token, process.env.jwtSecret))
 
     setTimeout(() => {
      res.redirect('/')
     }, 1000)
     
   }
})


module.exports = router;