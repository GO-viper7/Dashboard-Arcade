const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios').default;
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
require("dotenv").config();
router.use('/twiter', function(req, res) {
  var final="";
  if (req.url.includes('oauth_token') && req.url.includes('oauth_verifier')) {
      var k = req.url;
      k = k.slice(1);
      axios.get(`https://api.twitter.com/oauth/access_token${k}`)
      .then(response => {
          let w = response.data;
          let toke = k.indexOf("oauth_token")
          let veri = k.indexOf("oauth_verifier")
          let oauthOne = k.slice(toke+12, veri-2);
          let oauthTwo = k.slice(veri+15, k.length);
          let i = w.indexOf("user_id");
          let s = w.indexOf("screen_name");
          org = w.slice(i+8, s-1);
          let miDec = oauthTwo+oauthOne;
          let u=0
          for(let y = 0; y<org.length; y++) {
              final+=miDec[u++]
              final+=miDec[u++]
              final+=org[y]
          }  
  });
}
  setTimeout(() => {
      req.url.includes('oauth_token') ? res.render('response', {tok: final}) : res.render('index')
  }, 3000)
})



passport.use(new Strategy({
  consumerKey: process.env.consumer_key,
  consumerSecret: process.env.consumer_secret,
  callbackURL: `${process.env.websiteURL}/twiter`
}, function(token, tokenSecret, profile, callback) {
  return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
  callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
})


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))
router.use(passport.initialize())
router.use(passport.session())


router.get('/response', (req, res) => {
  res.render('response');
})

router.get('/twitter/login', passport.authenticate('twitter'))

router.get('/twitter/return', passport.authenticate('twitter', {
  failureRedirect: '/twiter'
}), function(req, res) {
  res.redirect('/twiter')
})



module.exports = router