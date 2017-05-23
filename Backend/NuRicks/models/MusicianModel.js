/**
 * Created by Pranav Kumar on 3/09/2017.
 */

var sequelize_modules = require("./init");
var gateway = sequelize_modules.gateway;
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
const util = require('util');
var hash = require('custom-hash');
hash.configure({ charSet: [ 'A', 'B', 'C', '1', '2', '3','4','5','6','7','8','9'], maxLength: 5 });

/*  Musician's model
 *
 *  fbid: The musicians's facebook ID (primary key)
 *
 */


 var Musicians = sequelize.define("Musicians", {

    fbid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },

    email: {
        type: Sequelize.STRING,
    },

    phoneNumber: {
        type: Sequelize.STRING,
    },

    stageName: {
    	type: Sequelize.STRING,
    },

    firstName: {
    	type: Sequelize.STRING,
    },

    lastName: {
    	type: Sequelize.STRING,
    },

    soundcloudLink: {
    	type: Sequelize.STRING,
    },

    bio: {
    	type: Sequelize.STRING
    },

    instagramLink: {
    	type: Sequelize.STRING
    },

    youtubeLink: {
    	type: Sequelize.STRING
    },

    facebookLink: {
    	type: Sequelize.STRING
    },

    urlValue:{
      type: Sequelize.STRING,
      unique: true
    },

    picture_url: { type: Sequelize.TEXT },
    verified: {type: Sequelize.BOOLEAN},

    customer_id: {type: Sequelize.INTEGER},
    card_digits: {type: Sequelize.STRING}
});

Musicians.sync();

passport.use('facebook-musicians', new FacebookStrategy({
    clientID: '222498668155227',
    clientSecret:  '7e600563610f0c8d21240afb25d44447',
    callbackURL: "http://nuricks.herokuapp.com/api/musicians/auth/facebook/callback",
    profileFields: ['id', 'name', 'picture','cover']  },
  function(accessToken, refreshToken, profile, cb) {
    const newMusician = Musicians.build({
      fbid: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture_url: profile.photos[0].value,
      urlValue: hash.digest(profile.id)
    });
    console.log("At the current HERE: " + hash.digest(newMusician.fbid));
    //cb(null, newMusician, { message: 'Musician created!' });
    newMusician.save().then(user => {
      if (user) {
        return cb(null, user, { message: 'Musician created!' });
      }
    }).catch(err => {
      sequelize.query('SELECT * FROM Musicians WHERE fbid = ' + profile.id + ';',
        { model: Musicians }).then(function(musician){
  // Each record will now be a instance of Project
          console.log("we here: "+ JSON.stringify(musician));
          return cb(null, musician[0], { message: 'Musician created!' });
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

MusiciansModel = {

    /*   Post requested in musicians.js
     *
     *   Creates a musician given the corresponding fields, and responds to the request
     *   with the musician object.
     *
     *   Arguments:
     *     res: Response Object Used to respond to a request
     *     fields: Fields must match the fields in the Musicians's model
     *
     */

    createMusician: function(res, fields){
        Musicians.create(fields).then(function(result){
            res.json({
                status: 1, Musician: result
            })
        }).catch(function(err){
            Musicians.findOne({
                where:{
                    fbid: fields["fbid"]
                }
            }).then(function(result){
            	res.json({status: -1, errors:['Unable to create musician as a musician already exists with this fbid', result]})
            });
    	})
    },

     /*   Get requested in musicians.js
     *
     *   Looks for a musician that is associated with the fbid passed.
     *   If a musician is found, the functions returns all the info(fields) of that
     *   musician.
     *
     *   Arguments:
     *     res: Response Object Used to respond to a request
     *     search: The email corresponding to the Musician we wish to update
     *
     *
     */

    getMusicianInfoFromID: function(res, search){
        Musicians.findOne({
            where:{
                fbid: search
            }
        }).then( function(musicianInfo){
            if(musicianInfo){
                res.json({status: "1", "musician_info": musicianInfo})
            }
            else{
                res.json({status: -1, errors: ['Musician does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find musician', err]});
        });
    },

    getMusicianInfoFromURL: function(res, search){
        Musicians.findOne({
            where:{
                urlValue: search
            }
        }).then( function(musicianInfo){
            if(musicianInfo){
                res.json({status: "1", "musician_info": musicianInfo})
            }
            else{
                res.json({status: -1, errors: ['Musician does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find musician', err]});
        });
    },

    loginMusician: function(res, search) {
      console.log(search);
        Musicians.findOne({
            where: {
                fbid: search
            }
        }).then( function(musicianInfo){
            res.setHeader("Access-Control-Allow-Credentials", true);
            if(musicianInfo){
                res.json({status: "1", "musician_info": musicianInfo})
            }
            else{
                res.json({status: -1, errors: ['Musician does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find musician', err]});
        });
    },

    deleteMusician: function(res, fbid){
        Musicians.remove({
            where: {
                fbid: fbid
            }
        }).then(function(musicianDelete){
            res.json({status: "1", "deleted_musician": musicianDelete})
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to delete Musician', err]});
        });
    },

    allMusicians: function(res){
        Musicians.findAll({
            }).then(function(result){
            if(!result){
                res.json({status: -1, errors:['No Musicians']})
            }
            else
            {
                res.json({status: 1, numUsers: result.length, musicians: result})
            }
        }).catch(function(err){
            res.json({status: -1, errors:['Error with call', err]})
        });
     },

     searchMusicians: function(res, searchTerm){
        Musicians.findAll({
            }).then(function(result){
            const foundMusicians = []
            for (let i = 0; i < result.length; i++) {
            // if search value not in fields, do not push too array
              if (result[i].stageName.indexOf(searchTerm) !== -1) {
                const data = result[i]
                foundMusicians.push(data)
              }
            }
          res.json({ status: 1, Musicians: foundMusicians })
              }).catch(function(err){
                  res.json({status: -1, errors:['Error with call', err]})
              });
     },

    updateMusicianInfoScreen: function (res, fbid, email, stageName, soundcloudLink, instagramLink, youtubeLink, facebookLink, picture_url, bio, phoneNumber){
        Musicians.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(editMusician) {
            editMusician.update({
                email: email,
                stageName:  stageName,
                soundcloudLink: soundcloudLink,
                instagramLink: instagramLink,
                youtubeLink: youtubeLink,
                facebookLink: facebookLink,
                picture_url: picture_url,
                bio: bio,
                phoneNumber: phoneNumber
            }).then(function(musician){
                res.json({status: 1, musician: musician});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit musician info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find musician', err]});
        })
    },

    updateMusicianCardDigits: function (res, fbid, digits){
        Musicians.findOne({
            where:{
                fbid: fbid
            }
        }).then(function(editMusician) {
            editMusician.update({
                card_digits: digits
            }).then(function(musician){
                res.json({status: 1, musician: musician});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit musician info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find musician', err]});
        })
    },

    createPaymentInformation: function(res, fbid, nonce){
        Musicians.findOne({
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
        Musicians.findOne({
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
            res.json({status: -2, errors: ['Unable to find Musician', err]});
        });

    },

    deleteCustomerPaymentInfo: function(res, search) {
        Musicians.findOne({
            where:{
                fbid: search
            }
        }).then(function(musicianInfo){
            gateway.customer.delete(musicianInfo.customer_id, function (err) {
                err;

                console.log("ERROR:" + err);
                console.log("Does it work?");
                // null
            });
            musicianInfo.update({
                customer_id: null
            });
            res.json({status: 1, "musician": "musician deleted"});
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find Musician', err]});
        });
    },
};

module.exports.Musicians = Musicians;
module.exports.MusiciansModel = MusiciansModel;
