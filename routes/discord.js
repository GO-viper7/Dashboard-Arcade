const express = require('express');
const router = express.Router();
const DiscordOauth2 = require("discord-oauth2");
const profileSchema = require('../schemas/profile-schema');
const oauth = new DiscordOauth2();
require("dotenv").config();
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
      redirectUri: `${process.env.websiteURL}/discord`,
    })
     res.cookies.set("key", jwt.sign(data.access_token, process.env.jwtSecret))
     let user = await oauth.getUser(data.access_token)
     profileSchema.countDocuments({userId: user.id}, async (err, count) => {
      if (count == 0) {
        await new profileSchema({
          userId: user.id,
        }).save()
      }
    })
    setTimeout(() => {
      res.redirect('/settings')
    }, 1000)
   }
})


module.exports = router;