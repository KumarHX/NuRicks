/**
 * Created by Pranav Kumar on 3/26/2017.
 */

var sequelize_modules = require("./init");
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
    customer_id: {type: Sequelize.INTEGER}
});

Users.sync();

passport.use(new FacebookStrategy({
    clientID: '222498668155227',
    clientSecret:  '7e600563610f0c8d21240afb25d44447',
    callbackURL: "http://localhost:3000/api/users/auth/facebook/callback",
    profileFields: ['id', 'name', 'profileUrl']  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("1: " + profile.id);
    Users.findOne({
      fbid: profile.id
    }).then(user => {
      console.log("user:" + user)
      if (user) {
        return cb(null, user, { message: 'User already exists' });
      }
      else {
        console.log("2: " + profile.id);
        const newUser = Users.build({
          fbid: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture_url: profile.profileUrl
        });
        console.log("At the current: " + newUser.fbid);
        cb(null, newUser, { message: 'User created!' });
        newUser.save().then(user => {
          if (user) {
            return console.log("User created");
            // return cb(null, user, { message: 'User created!' });
          }
        }).catch(err => cb(err));
      }
    }).catch(err => cb(err));
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
    }

};

module.exports.Users = Users;
module.exports.UsersModel = UsersModel;
