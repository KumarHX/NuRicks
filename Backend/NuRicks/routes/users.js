var express = require('express');
var router = express.Router();
var passport = require('passport');
var user_models = require("../models/UserModel");
var jwt = require("jwt-simple")
var UsersModel =  user_models.UsersModel;
const secret = "changethisinproduction";

router.get('/auth/facebook', passport.authenticate('facebook'));


router.get('/auth/facebook/callback', passport.authenticate('facebook'),
  (req, res) => {
    console.log("sent fbid: " + req.user.fbid)
    const payload = {fbid: req.user.fbid};
    const token = jwt.encode(payload, secret);
    // res.cookie('jwt', token);
    req.session.key = token;
    // Successfully authenticated, redirect.
    res.redirect('http://localhost:8001/');
});


router.get('/auth', (req, res) => {
    var session = jwt.decode(req.session.key, secret);
    var fbid = session.fbid;
    UsersModel.loginUser(res, fbid);
});


router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('http://localhost:8001/');
});