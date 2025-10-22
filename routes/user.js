const express = require('express');
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { isLoggedIn , saveRedirect } = require('../middleware');
const userController = require("../Controller/user");

router.get('/signup',userController.renderSignUp);

router.post('/signup',wrapAsync(userController.postSignUp));

router.get("/login",userController.renderLogin); 

router.post('/login',saveRedirect,passport.authenticate('local',{
    failureRedirect : '/login',
    failureFlash : true,
}),userController.postLogin);

router.get("/logout",isLoggedIn,userController.logOut);


module.exports = router;