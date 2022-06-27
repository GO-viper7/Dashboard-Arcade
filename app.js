const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config({path: './config.env'});
const app = express();
const cookies = require('cookies')
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const discordRoutes = require('./routes/discord');
const invRoutes = require('./routes/inventory')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(cookies.express(["some", "random", "keys"]))

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(discordRoutes);
app.use(invRoutes);
app.use('/twiter', function(req, res) {
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

const axios = require('axios').default;
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');

passport.use(new Strategy({
    consumerKey: process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    callbackURL: 'https://dashboard-77.herokuapp.com/twiter'
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

// 



app.get('/response', (req, res) => {
    res.render('response');
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/twiter'
}), function(req, res) {
    res.redirect('/twiter')
})



app.listen(process.env.PORT || 3000);
