const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const json = require('../test.json');
const inv = require('../inv.json')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: "978339805496750150",
	clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
	redirectUri: "http://localhost:3000/discord",
});
let k = json
let l = inv



router.get('/inventory', async (req, res, next) => {
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(cookies)
  l = inv.filter( x => x.user == user.id)
  if (l.length == 0) {
  return res.render('inventory', {bool: false});
  }
  
  var p = []
  for(var t = 0; t< l.length; t++) {
    for(var e = 0; e< json.length; e++) {
       if (l[t].id == json[e].id) {
         p.push(json[e])
       }
    }
  }
  res.render('inventory', {prod: p, bool: true});
  p=[]
});




module.exports = router;