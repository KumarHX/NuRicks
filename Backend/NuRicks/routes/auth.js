var express = require('express');
var router = express.Router();
var passport = require('passport');
var musician_models = require("../models/MusicianModel");
var jwt = require("jwt-simple")
var MusiciansModel =  musician_models.MusiciansModel;
var user_models = require("../models/UserModel");
var UsersModel =  user_models.UsersModel;
const secret = "changethisinproduction";


router.get('/', (req, res) => {
    if (typeof req.session.key === 'undefined') {
        res.json({error: "noauth"});
        return;
    }
    var session = jwt.decode(req.session.key, secret);
    var fbid = session.fbid;
    var userType = session.userType;
    console.log(userType);
    if (userType == "musician") {
        MusiciansModel.loginMusician(res, fbid);
    }
    else if (userType == "user") {
        UsersModel.loginUser(res, fbid);
    }
    else {
        res.json({error: "noauth"});
    }
})

router.get('/logout', (req, res) => {
    req.session = null;
    res.json({"status": true});
});

module.exports = router;
