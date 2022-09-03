const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
const {v4 : uuidv4} = require('uuid')
const server = require("http").Server(app);
const cookies = require('cookies')
const { connect } = require('mongoose');
connect(process.env.mongoPath, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Database connected');
});

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const discordRoutes = require('./routes/discord');
const invRoutes = require('./routes/inventory')
const twitterRoutes = require('./routes/twitter')
const profileRoutes = require('./routes/profile')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(cookies.express(["some", "random", "keys"]))

app.use(adminData.router);
app.use(shopRoutes.router);
app.use(discordRoutes);
app.use(invRoutes);
app.use(twitterRoutes);
app.use(profileRoutes);

server.listen(process.env.PORT || 3000, () => {
  console.log('Running on localhost 3000')
});



// Things to do : settings post, orders-> [...] [onClick] [status click mail]

// Backend Adjust, unique alert and profile alert

