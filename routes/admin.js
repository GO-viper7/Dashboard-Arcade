const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const fs = require('fs');
const json = require('../test.json');
const users = require('../users.json')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: "978339805496750150",
	clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
	redirectUri: "https://dashboard-77.herokuapp.com/discord",
});

// /admin/add-product => GET
router.get('/add-product', async (req, res, next) => {
  let cookies = req.cookies.get('key')
  
  if (cookies) {
    let user = await oauth.getUser(cookies)
    users.forEach(x => {
      
      if (x.userId == user.id) {
        return res.render('add-product', {prod: json});
      }
         
    })
  }
  else {
    return res.redirect('/')
  }
    
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body)
  json.forEach(x => {
      if (x.id == req.body.id) {
        x.cost = Number(req.body.cost);
        x.stock = Number(req.body.stock)
        x.name = req.body.name
        x.category = req.body.category
        
      }
  })
  //console.log(json)
  fs.writeFileSync(path.join(__dirname, '../test.json'), JSON.stringify(json, null, 2), 'utf-8', writeJSON = (err) => {
      if(err) {
        console.log(err.message);
      }
  } )
});

// /admin/add-product => POST


exports.routes = router;
