const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const crypto = require('crypto')
const DiscordOauth2 = require("discord-oauth2");
const Cookies = require('cookies');
const oauth = new DiscordOauth2();
const inv = require('../inv.json');
router.get('/discord', async  (req, res) => {
 
   let code = req.query.code;
   console.log('here r cookies1')
   console.log(code)
   if( code == undefined) {
     res.send('Auth code is undefined')
   }
   else {
  
    let data = await oauth.tokenRequest({
      clientId: "978339805496750150",
      clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
      code: code,
      scope: "identify guilds",
      grantType: "authorization_code",
      redirectUri: "http://localhost:3000/discord",
    })
     
     res.cookies.set("key", data.access_token)
 
     setTimeout(() => {
      res.redirect('/')
     }, 1000)
     
   }
})


module.exports = router;