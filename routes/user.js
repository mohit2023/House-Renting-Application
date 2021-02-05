const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const user = require('../controllers/user');


router.route('/register')
  .get(user.renderRegisterForm)
  .post(wrapAsync(user.register));

router.route('/login')
  .get(user.renderLoginForm)
  .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login);

router.get('/logout', user.logout)


module.exports = router;