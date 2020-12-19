const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/register', users.registerForm)

router.post('/register', catchAsync(users.register));

router.get('/login', (req, res) => {
    res.render('userAuth/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;

// User validation failed: email: Please fill in a valid email address