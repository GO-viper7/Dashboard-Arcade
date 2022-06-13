const path = require('path');

const express = require('express');
const fs = require('fs')
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();
const json = require('../test.json')
const users = require('../users.json')
const inv = require('../inv.json')
var k = json
const all = json
var q = 0

const crypto = require('crypto')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
	clientId: "978339805496750150",
	clientSecret: "OdbZvWky-P8fYi_lMcbh_49Y2L_f4S0D",
	redirectUri: "https://dashboard-77.herokuapp.com/discord",
});

const url = oauth.generateAuthUrl({
	scope: ["identify", "guilds"],
	state: crypto.randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
});



const { connect } = require('mongoose');

connect('mongodb+srv://GoViper:GoViperUC123@cluster.sbavr.mongodb.net/TinyArcade?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Database connected');
});

const profileSchema = require('../schemas/profile-schema');
const inventorySchema = require('../schemas/inv-schema');
const { profile } = require('console');
const { UserCollection } = require('disco-oauth/lib/types');








router.get('/', async (req, res, next) => {
 // console.log(res.cookies.get("cat"))
  if (req.cookies.get('first') == undefined) {
    
    res.cookie("cat", `cat`, {httpOnly: false, overwrite: true})
    res.cookies.set("first", 'permanent')
  }
  
  let cookies = req.cookies.get('key')
  
  if (cookies) {
    let user = await oauth.getUser(cookies)
    var o = 0;
    var invi = []
    const result = await inventorySchema.findOne({
          userId: user.id
      })

      let invis = []
      if (result) {
          invis = result.Inventory
      } else {
         
          await new inventorySchema({
              userId : user.id,
              Inventory : invis
          }).save()
      }
    
    profileSchema.findOne({userId: user.id}, async (err, data) => {
      if (data) {
        o = data.OctaCreds
      }
      if (req.cookies.get('cat') == undefined) {
        k = json.filter(x => x.category == x.category)
      }
      else k = json.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) )
      return res.render('shop', {prod: k, user: user.username, id : user.id, url: url, coins: o, bool: '', ids: users, inv : invis})
  })
  
  }
  else {
    if (req.cookies.get('cat') == undefined) {
      k = json.filter(x => x.category == x.category)
    }
    else 
      k = json.filter(x => x.category == (`${req.cookies.get('cat')}` == 'cat' ? x.category : `${req.cookies.get('cat')}`) ) 
    return res.render('shop', {prod: k,  url: url, user: '', coins: '', bool: '', inv: ''})
  }

});





router.post('/', async (req, res, next) => {
  console.log( req.body)
  let cookies = req.cookies.get('key')
  if (cookies) {
    
    let user = await oauth.getUser(cookies)
    var o = 0;
    if ( req.body.red == true) {
      console.log('goin to red')
      profileSchema.findOneAndUpdate({userId: user.id}, {OctaCreds : req.body.cost}, null, async (err, data) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(data)
        }
    })
    json.forEach(x => {
        if (x.id == req.body.id) {
          x.stock -= 1
          
        }
    })
    

    
    
    inventorySchema.findOneAndUpdate({userId: user.id}, {Inventory: req.body.arr}, null,  async (err, data) => {
      if (data) {
        console.log(data)
    } 
    if (err) {
      console.log(err)
    }
    })
     
   
    inv.push({user: user.id, id: req.body.id})



    fs.writeFileSync(path.join(__dirname, '../inv.json'), JSON.stringify(inv, null, 2), 'utf-8', writeJSON = (err) => {
      if(err) {
        console.log(err.message);
      }
  
    return 
    } )



    fs.writeFileSync(path.join(__dirname, '../test.json'), JSON.stringify(json, null, 2), 'utf-8', writeJSON = (err) => {
      if(err) {
        console.log(err.message);
      }
  
    return 
    } )
    }
 
  }
});











module.exports = router;
