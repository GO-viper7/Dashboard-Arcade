const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const itemSchema = require('../schemas/item-schema');
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: "978339805496750150",
	clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
	redirectUri: "https://dashboard-77.herokuapp.com/discord",
});


router.get('/inventory', async (req, res, next) => {
  let l
  let cookies = req.cookies.get('key')
  let user = await oauth.getUser(cookies)
  var result = await  itemSchema.find({})
  //console.log(result)
  l = result.filter(x => x.userId == user.id )
  if (l.length == 0) {
  return res.render('inventory', {bool: false});
  }
  res.render('inventory', {prod: l, bool: true});
});




module.exports = router;