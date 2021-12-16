const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = (passport) => {
  var opts = {};
  opts.secretOrKey = settings.secret;

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('register', new localStrategy({
    usernameField : 'username',
    passwordField : 'password'
  }, async (username, password, done) => {
      try {
        const user = await User.create({ username, password });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
  }));

  passport.use('login', new localStrategy({
    usernameField : 'username',
    passwordField : 'password'
  }, async (username, password, done) => {
    try {      
      const user = await User.findOne({ username });
      if (!user)
        return done(null, false);

      const validate = await user.comparePassword(password);
      if (!validate)
        return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
};