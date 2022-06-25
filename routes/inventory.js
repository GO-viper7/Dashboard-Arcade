const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const itemSchema = require('../schemas/item-schema');
const DiscordOauth2 = require("discord-oauth2");
const config = require('../config.json')
const oauth = new DiscordOauth2({
	clientId: config.clientId,
	clientSecret: config.clientSecret,
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