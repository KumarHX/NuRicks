var express = require('express');
var router = express.Router();
var admin_models = require("../models/AdminModel");
var AdminModel =  admin_models.AdminsModel;


router.post('/login', function(req, res, next){
    var uname = req.body.username;
    var pword = req.body.password;
    AdminModel.login(res, uname, pword);
});

router.post('/signup', function(req, res, next){
    var admin_info = req.body;
    AdminModel.createAdmin(res, admin_info);
});


module.exports = router;