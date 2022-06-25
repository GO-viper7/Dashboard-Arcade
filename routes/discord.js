const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const crypto = require('crypto')
const DiscordOauth2 = require("discord-oauth2");
const Cookies = require('cookies');
const oauth = new DiscordOauth2();
const config = require('../config.json')
router.get('/discord', async  (req, res) => {
 
   let code = req.query.code;
   console.log('here r cookies1')
   console.log(code)
   if( code == undefined) {
     res.send('Auth code is undefined')
   }
   else {
  
    let data = await oauth.tokenRequest({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      code: code,
      scope: "identify guilds",
      grantType: "authorization_code",
      redirectUri: "https://dashboard-77.herokuapp.com/discord",
    })
     
     res.cookies.set("key", data.access_token)
 
     setTimeout(() => {
      res.redirect('/')
     }, 1000)
     
   }
})


module.exports = router;