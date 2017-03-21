var express = require('express');
var router = express.Router();
var passport = require('passport');
var musician_models = require("../models/MusicianModel");
var MusiciansModel =  musician_models.MusiciansModel

/*
 *  Handles signup request
 *
 *  musician_info: contains request body.
 */

router.post('/signup', function(req, res, next){
    var musician_info = req.body;
    MusiciansModel.createUser(res, musician_info);
});

/*
 *  Find a musician
 *
 *  email: email to search on
 */

router.get('/getMusicianInfoFromEmail/:email', function(req, res, next){
    var search = req.params.email;
    MusiciansModel.getMusicianInfoFromEmail(res, search);
});

/*
 *  Delete a musician
 *
 *  email: email to search on
 */

router.get('/deleteMusician/:email', function(req, res, next){
    var search = req.params.email;
    MusiciansModel.deleteMusician(res, search);
});



router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook'),
  (req, res) => {
    // Successfully authenticated, redirect.
    res.redirect('http://localhost:8001/');
  })



router.post('/updateMusicianInfo', function(req, res, next){
    var email = req.body.email;
    var	stageName = req.body.stageName;
    var	bio = req.body.bio;
    var	soundcloudLink = req.body.soundcloudLink;
    var	instagramLink = req.body.instagramLink;
    var	youtubeLink = req.body.youtubeLink;
    var	facebookLink = req.body.facebookLink;
    var picture_url = req.body.picture_url;
    MusiciansModel.updateMusicianInfoScreen(res, email, stageName, soundcloudLink, instagramLink, youtubeLink, facebookLink, picture_url, bio);
});


module.exports = router;
