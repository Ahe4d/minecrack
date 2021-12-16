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
  .then(() =>  logger.dbLogger.info('Connection successful!'))
  .catch((err) => logger.dbLogger.error(err));

app.use(cookieParser(settings.cookieSecret));
app.use(session({
  key: settings.cookieKey,
  secret: settings.cookieSecret,
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure : false, maxAge : (4 * 60 * 60 * 1000)}
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(path.join(__dirname, '/public')));

let listener = app.listen(process.env.PORT || 8080, function(srv) {
  console.log('Application up at port ' + listener.address().port);
})