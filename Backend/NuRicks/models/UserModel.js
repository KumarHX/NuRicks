/**
 * Created by Pranav Kumar on 3/26/2017.
 */

var sequelize_modules = require("./init");
var gateway = sequelize_modules.gateway;
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
const util = require('util')

/*  User's model
 *
 *  fbid: The user's facebook ID (primary key)
 *
 */

 var Users = sequelize.define("Users", {

    fbid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },

    email: {
        type: Sequelize.STRING,
    },


    firstName: {
    	type: Sequelize.STRING,
    },

    lastName: {
    	type: Sequelize.STRING,
    },

    picture_url: { type: Sequelize.TEXT },
    customer_id: {type: Sequelize.INTEGER},
    card_digits: {type: Sequelize.STRING}
});

Users.sync();

passport.use('facebook-users', new FacebookStrategy({
    clientID: '222498668155227',
    clientSecret:  '7e600563610f0c8d21240afb25d44447',
    callbackURL: "http://nuricks.herokuapp.com/api/users/auth/facebook/callback",
    profileFields: ['id', 'name', 'profileUrl']  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("1: " + profile.id);
    console.log("2: " + profile.id);
    const newUser = Users.build({
      fbid: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture_url: profile.profileUrl
    });
    console.log("At the current: " + newUser.fbid);
    newUser.save().then(user => {
      if (user) {
        return cb(null, user, { message: 'User created!' });
      }
    }).catch(err => {
      sequelize.query('SELECT * FROM Users WHERE fbid = ' + profile.id + ';',
        { model: Users }).then(function(user){
  // Each record will now be a instance of Project
          console.log("we here: "+ JSON.stringify(user));
          return cb(null, user[0], { message: 'User created!' });
        })
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
 done(null, user);
});

UsersModel = {

	loginUser: function(res, search) {
      console.log(search);
        Users.findOne({
            where: {
                fbid: search
            }
        }).then( function(userInfo){
            res.setHeader("Access-Control-Allow-Credentials", true);
            if(userInfo){
                res.json({status: "1", "user_info": userInfo})
            }
            else{
                res.json({status: -1, errors: ['User does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find User', err]});
        });
    },

    /*   Get requested in users.js
     *
     *   Given a user's email, as well as their payment method nonce, updates the user's
     *   customer ID via creating a customer with the braintree API.
     *
     *   Arguments:
     *     res: Response Object Used to respond to a request
     *     user_email: The email corresponding to the User we wish to update
     *     nonce: The payment method nonce from the braintree API.
     *
     */

    createPaymentInformation: function(res, fbid, nonce){
        Users.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(result){
            if(!result){
                res.json({status: -1, errors:['User does not exist']})
            }
            else{
                gateway.customer.create({
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    paymentMethodNonce: nonce
                }, function (err, braintree_result) {
                    if(braintree_result.success) {
                        result.update({
                            customer_id: braintree_result.customer.id
                        }).then(function (result) {
                            res.json({status: 1, user: result});
                        })
                    }
                    else{
                        res.json({status: -2, errors:['Unable to create customer from nonce', err]})
                    }
                });
            }
        }).catch(function(err){
            res.json({status: -1, errors:['Error with Sequelize call', err]})
        });
    },

     updateCustomerPaymentInfo: function(res, fbid, nonceFromTheClient) {
        Users.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(userInfo){
            gateway.customer.update(userInfo.customer_id + "", {
                email: inputEmail,
                paymentMethodNonce: nonceFromTheClient
            }, function (err, result) {
                if(err != null)
                {
                    res.json({status: -1, "customer": "credit card info is fucked, cant update"});
                }
            });
            res.json({status: 1, "customer": "customer updated"});
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -2, errors: ['Unable to find User', err]});
        });

    },

    getUserInfoFromID: function(res, search){
        Users.findOne({
            where:{
                fbid: search
            }
        }).then( function(userInfo){
            if(userInfo){
                res.json({status: "1", "user_info": userInfo})
            }
            else{
                res.json({status: -1, errors: ['User does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -2, errors: ['Unable to find user', err]});
        });
    },

    getUserInfoFromCustomerID: function(res, search){
        Users.findOne({
            where:{
               customer_id : search
            }
        }).then( function(userInfo){
            if(userInfo){
                res.json({status: "1", "user_info": userInfo})
            }
            else{
                res.json({status: -1, errors: ['User does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -2, errors: ['Unable to find user', err]});
        });
    },

    updateUserInfoScreen: function (res, fbid, email){
        Users.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(editUser) {
            editUser.update({
                email: email
            }).then(function(user){
                res.json({status: 1, user: user});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit user info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find user', err]});
        })
    },

    updateUserCardDigits: function (res, fbid, digits){
        Users.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(editUser) {
            editUser.update({
                card_digits: digits
            }).then(function(user){
                res.json({status: 1, user: user});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit user info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find user', err]});
        })
    },

    deleteCustomerPaymentInfo: function(res, search) {
        Users.findOne({
            where:{
                fbid: search
            }
        }).then(function(userInfo){
            gateway.customer.delete(userInfo.customer_id, function (err) {
                err;

                console.log("ERROR:" + err);
                console.log("Does it work?");
                // null
            });
            userInfo.update({
                customer_id: null
            });
            res.json({status: 1, "customer": "customer deleted"});
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find User', err]});
        });
    },

};

module.exports.Users = Users;
module.exports.UsersModel = UsersModel;
