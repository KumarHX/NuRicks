var express = require('express');
var router = express.Router();
var passport = require('passport');
var musician_models = require("../models/MusicianModel");
var jwt = require("jwt-simple")
var MusiciansModel =  musician_models.MusiciansModel;
const secret = "changethisinproduction";

/*
 *  Handles signup request
 *
 *  musician_info: contains request body.
 */

router.post('/signup', function(req, res, next){
    var musician_info = req.body;
    MusiciansModel.createMusician(res, musician_info);
});

/*
 *  Find a musician
 *
 *  fbid: fbid to search on
 */

router.get('/getMusicianInfoFromID/:fbid', function(req, res, next){
    var search = req.params.fbid;
    MusiciansModel.getMusicianInfoFromID(res, search);
});

router.get('/searchMusicians/:search', function(req, res, next){
    var search = req.params.search;
    MusiciansModel.searchMusicians(res, search);
});


router.get('/getMusicianInfoFromURL/:url', function(req, res, next){
    var search = req.params.url;
    MusiciansModel.getMusicianInfoFromURL(res, search);
});

/*
 *  Delete a musician
 *
 *  fbid: fbid to search on
 */

router.get('/deleteMusician/:fbid', function(req, res, next){
    var search = req.params.fbid;
    MusiciansModel.deleteMusician(res, search);
});

router.get('/allMusicians', function(req, res, next){
    MusiciansModel.allMusicians(res);
});

router.post('/createPaymentInformationSTRIPE/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    MusiciansModel.createPaymentInformationSTRIPE(res, fbid, nonce);
});

router.post('/updateCustomerPaymentInfoSTRIPE/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    MusiciansModel.updateCustomerPaymentInfoSTRIPE(res, fbid, nonce);
});



router.post('/createPaymentInformation/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    MusiciansModel.createPaymentInformation(res, fbid, nonce);
});

router.post('/updateCustomerPaymentInfo/:fbid', function(req, res, next){
    var nonce = req.body.payment_method_nonce;
    var fbid = req.params.fbid;
    MusiciansModel.updateCustomerPaymentInfo(res, fbid, nonce);
});

router.get('/updateMusicianTOS/:fbid', function(req, res, next){
    var fbid = req.params.fbid;
    MusiciansModel.updateMusicianVerified(res, fbid);
});


router.get('/auth/facebook', passport.authenticate('facebook-musicians'));

router.get('/auth/facebook/callback', passport.authenticate('facebook-musicians'),
  (req, res) => {
    console.log("sent fbid: " + req.user.fbid)
    const payload = {fbid: req.user.fbid, userType: "musician"};
    const token = jwt.encode(payload, secret);
    // res.cookie('jwt', token);
    req.session.key = token;
    // Successfully authenticated, redirect.
    res.redirect('https://nrtickets.com/nuricks-frontend/');
  })

router.get('/auth/test', (req, res) => {
    const payload = {fbid: "433300887023476"}
    const token = jwt.encode(payload, secret);
    // res.cookie('jwt', token);
    req.session.key = token;
    res.redirect('https://nrtickets.com/nuricks-frontend/');
})

router.post('/updateMusicianInfo', function(req, res, next){
    var fbid = req.body.fbid;
    var email = req.body.email;
    var	stageName = req.body.stageName;
    var	bio = req.body.bio;
    var	soundcloudLink = req.body.soundcloudLink;
    var	instagramLink = req.body.instagramLink;
    var	youtubeLink = req.body.youtubeLink;
    var	facebookLink = req.body.facebookLink;
    var picture_url = req.body.picture_url;
    var phoneNumber = req.body.phoneNumber;
    MusiciansModel.updateMusicianInfoScreen(res, fbid, email, stageName, soundcloudLink, instagramLink, youtubeLink, facebookLink, picture_url, bio, phoneNumber);
});

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('https://nrtickets.com/nuricks-frontend/');
});

router.get('/deleteCustomerPaymentInfo/:fbid', function(req, res, next){
    var search = req.params.fbid;
    MusiciansModel.deleteCustomerPaymentInfo(res, search);
});

router.post('/updateCardDigits', function(req, res, next){
    var fbid = req.body.fbid;
    var digits = req.body.digits;
    MusiciansModel.updateMusicianCardDigits(res, fbid, digits);
});

router.get('/deleteCustomerPaymentInfoSTRIPE/:fbid', function(req, res, next){
    var search = req.params.fbid;
    MusiciansModel.deleteCustomerPaymentInfoSTRIPE(res, search);
});


module.exports = router;
