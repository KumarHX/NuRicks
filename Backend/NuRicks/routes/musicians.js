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

/*
 *  Delete a musician
 *
 *  fbid: fbid to search on
 */

router.get('/deleteMusician/:fbid', function(req, res, next){
    var search = req.params.fbid;
    MusiciansModel.deleteMusician(res, search);
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
    res.redirect('http://localhost:8001/');
  })

router.get('/auth/test', (req, res) => {
    const payload = {fbid: "433300887023476"}
    const token = jwt.encode(payload, secret);
    // res.cookie('jwt', token);
    req.session.key = token;
    res.redirect('http://localhost:8001/')
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
    MusiciansModel.updateMusicianInfoScreen(res, fbid, email, stageName, soundcloudLink, instagramLink, youtubeLink, facebookLink, picture_url, bio);
});

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('http://localhost:8001/');
});

module.exports = router;
