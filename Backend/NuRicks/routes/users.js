var express = require('express');
var router = express.Router();
var passport = require('passport');
var user_models = require("../models/UserModel");
var jwt = require("jwt-simple")
var UsersModel =  user_models.UsersModel;
const secret = "changethisinproduction";

router.get('/auth/facebook', passport.authenticate('facebook-users'));

router.get('/auth/facebook/callback', passport.authenticate('facebook-users'),
  (req, res) => {
    console.log("sent fbid: " + req.user.fbid)
    const payload = {fbid: req.user.fbid, userType: "user"};
    const token = jwt.encode(payload, secret);
    // res.cookie('jwt', token);
    req.session.key = token;
    // Successfully authenticated, redirect.
    res.redirect('http://localhost:8001/');
});

router.post('/updateCustomerPaymentInfo/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    UsersModel.updateCustomerPaymentInfo(res, fbid, nonce);
});

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('http://localhost:8001/');
});

module.exports = router;
