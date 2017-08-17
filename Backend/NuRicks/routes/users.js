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
    res.redirect('http://nrtickets.com/');
});



router.post('/createPaymentInformationSTRIPE/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    var digits = req.body.digits;
    UsersModel.createPaymentInformationSTRIPE(res, fbid, nonce, digits);
});


router.post('/createPaymentInformation/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    UsersModel.createPaymentInformation(res, fbid, nonce);
});

router.post('/updateCustomerPaymentInfoSTRIPE/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    UsersModel.updateCustomerPaymentInfoSTRIPE(res, fbid, nonce);
});


router.post('/updateCustomerPaymentInfo/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    UsersModel.updateCustomerPaymentInfo(res, fbid, nonce);
});

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('http://nrtickets.com/');
});

router.get('/getUserInfoFromID/:fbid', function(req, res, next){
    var search = req.params.fbid;
    UsersModel.getUserInfoFromID(res, search);
});

router.get('/getUserInfoFromCustomerID/:customerID', function(req, res, next){
    var search = req.params.customerID;
    UsersModel.getUserInfoFromCustomerID(res, search);
});

router.post('/updateUserInfo', function(req, res, next){
    var fbid = req.body.fbid;
    var email = req.body.email;
    UsersModel.updateUserInfoScreen(res, fbid, email);
});

router.post('/updateCardDigits', function(req, res, next){
    var fbid = req.body.fbid;
    var digits = req.body.digits;
    UsersModel.updateUserCardDigits(res, fbid, digits);
});

router.get('/deleteCustomerPaymentInfoSTRIPE/:fbid', function(req, res, next){
    var search = req.params.fbid;
    UsersModel.deleteCustomerPaymentInfoSTRIPE(res, search);
});


router.get('/deleteCustomerPaymentInfo/:fbid', function(req, res, next){
    var search = req.params.fbid;
    UsersModel.deleteCustomerPaymentInfo(res, search);
});

module.exports = router;
