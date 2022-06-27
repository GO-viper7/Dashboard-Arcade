const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
const cookies = require('cookies')


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const discordRoutes = require('./routes/discord');
const invRoutes = require('./routes/inventory')
const twitterRoutes = require('./routes/twitter')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(cookies.express(["some", "random", "keys"]))

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(discordRoutes);
app.use(invRoutes);
app.use(twitterRoutes);


app.listen(process.env.PORT || 3000);
