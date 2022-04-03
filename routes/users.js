const passport = require('passport');
const express = require('express');
const { isLoggedin } = require('../middleware');
const router = express.Router();
const user = require('../controllers/user')

router.get('/register', user.renderRegisterPage)

router.post('/register', user.registerUser)

router.get('/login', user.renderLoginPage)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.renderPreviousPage)

router.get('/logout', isLoggedin, user.logOut)

module.exports = router;