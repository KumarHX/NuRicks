var express = require('express');
var router = express.Router();
var passport = require('passport');
var musician_models = require("../models/MusicianModel");
var jwt = require("jwt-simple")
var MusiciansModel =  musician_models.MusiciansModel;
var user_models = require("../models/UserModel");
var UsersModel =  user_models.UsersModel;
const secret = "changethisinproduction";


router.get('/auth', (req, res) => {
    var session = jwt.decode(req.session.key, secret);
    var fbid = session.fbid;
    var userType = session.userType;
    if (userType == "musician") {
        MusiciansModel.loginMusician(res, fbid);
    }
    else {
        UserModel.loginuser(res, fbid);
    }
})