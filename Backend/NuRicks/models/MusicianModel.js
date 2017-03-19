/**
 * Created by Pranav Kumar on 3/09/2017.
 */

var sequelize_modules = require("./init");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy

/*  Musician's model
 *
 *  email: The musicians's email address.
 *
 */


 var Musicians = sequelize.define("Musicians", {
    email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
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

    fbid: { 
    	type: Sequelize.STRING
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

    picture_url: { type: Sequelize.TEXT },
    verified: {type: Sequelize.BOOLEAN}
});

Musicians.sync();

passport.use(new FacebookStrategy({
  clientID: '222498668155227',
  clientSecret:  '7e600563610f0c8d21240afb25d44447',
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'name', 'email']
}, (token, tokenSecret, profile, cb) => {
  // Do things with the profile here
  console.log('Well, you\'ve hit the Facebook callback.')
  Musicians.findOne({
    fbid: profile.userID,
  }, (err, musician) => {
    if (err) {
      return cb(err)
    }
    if (musician) {
      return cb(null, musician)
    }

      // Create object to insert
    const newMusician = new Musicians({
      platformName: 'facebook',
      fbid: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.email
    })
    newMusician.save((err) => {
      if (err) {
        console.log('Error while registering musician: ', err)
        return cb(err)
      }
      return cb(null, newMusician)
    })
  })
}))

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
                    email: fields["email"]
                }
            }).then(function(result){
            	res.json({status: -1, errors:['Unable to create musician as a musician already exists with this email', result]})
            });
    	})
    },

     /*   Get requested in musicians.js
     *
     *   Looks for a musician that is associated with the email address passed.
     *   If a musician is found, the functions returns all the info(fields) of that
     *   musician.
     *
     *   Arguments:
     *     res: Response Object Used to respond to a request
     *     search: The email corresponding to the Musician we wish to update
     *
     *
     */

    getMusicianInfoFromEmail: function(res, search){
        Musicians.findOne({
            where:{
                email: search
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

    deleteMusician: function(res, musicianEmail){
        Musicians.remove({
            where: {
                email: musicianEmail
            }
        }).then(function(musicianDelete){
            res.json({status: "1", "deleted_musician": musicianDelete})
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to delete Musician', err]});
        });
    },

    updateMusicianInfoScreen: function (res, email, stageName, soundcloudLink, instagramLink, youtubeLink, facebookLink, picture_url, bio){
        Musicians.findOne({
            where:{
                email: email
            }
        }).then(function(editMusician) {
            editMusician.update({
                stageName:  stageName,
                soundcloudLink: soundcloudLink,
                instagramLink: instagramLink,
                youtubeLink: youtubeLink,
                facebookLink: facebookLink,
                picture_url: picture_url,
                bio: bio
            }).then(function(musician){
                res.json({status: 1, musician: musician});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit musician info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find musician', err]});
        })
    },
};

module.exports.Musicians = Musicians;
module.exports.MusiciansModel = MusiciansModel;