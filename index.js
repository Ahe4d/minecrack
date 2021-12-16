/* 
  [-------------]
  Minecrack
  by Ahead, 2021
  [-------------]
*/

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const settings = require('./config/settings');

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://' + process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('Connection successful!'))
  .catch((err) => console.error(err));

app.use(cookieParser(settings.cookieSecret));
app.use(session({
  key: settings.cookieKey,
  secret: settings.cookieSecret,
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure : false, maxAge : (4 * 60 * 60 * 1000)}
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(path.join(__dirname, '/public')));

app.locals = {
  site: {
    title: "Minecraft",
    description: "Minecraft authentication server",
    version: "0.1.0-alpha",
    baseurl: "changeme"
  },
  author: {
    name: "Your Mother"
  }
}

/* Routes */
try {
  app.use('/', require('./routes/main'))
  console.log("Loaded routes!")
} catch (err) {
  console.log("Error while loading routes!\n", err)
}

let listener = app.listen(process.env.PORT || 8080, function(srv) {
  console.log('Application up at port ' + listener.address().port);
})