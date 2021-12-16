var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

/* Index */
router.get('/', function (req, res, next) {
  return res.render('pages/index', { title: 'Home' })
})

function isLoggedInInv(req, res, next) {
  if (!req.user) {
    return next();
  } else
    req.flash('error', 'You are already logged in!');
    return res.redirect("/") 
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else
    req.flash('error', 'You are not logged in!');
    console.log('user isnt logged in')
    return res.redirect("/") 
}

module.exports = router;