/**
 * Created by Pranav Kumar on 4/01/2017.
 */

var sequelize_modules = require("./init");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
const util = require('util');

/*  Musician's model
 *
 *  id: The event's ID (primary key)
 *
 */

 var Events = sequelize.define("Events", {

    eventName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    doorsOpen: {
    	type: Sequelize.STRING,
    	allowNull: false
    },

    ShowStarts: {
    	type: Sequelize.STRING,
    	allowNull: false
    },

    street_name: { type: Sequelize.STRING, allowNull: false},
    zip_code:{type: Sequelize.INTEGER, allowNull: false},
    city:{type: Sequelize.STRING, allowNull: false},
    state:{type: Sequelize.STRING, allowNull: false},
    ageRequirement:{type: Sequelize.STRING, allowNull: false},
    cost:{type: Sequelize.INTEGER, allowNull: false},
    extraAtDoor:{type: Sequelize.INTEGER},
});

Events.sync();

EventsModel = {

	 createEvent: function(res, fields){
        Events.create(fields).then(function(results){
            res.json({
                status:1, Event: results
            })
        }).catch(function(err){
            res.json({status: -1, errors:['Unable to create this Event',err]});
        });
    },

    getEventInfoFromID: function(res, search){
        Events.findOne({
            where:{
                id: search
            }
        }).then( function(eventInfo){
            if(eventInfo){
                res.json({status: "1", "event_info": eventInfo})
            }
            else{
                res.json({status: -1, errors: ['Event does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find Event', err]});
        });
    },


};


module.exports.Events = Events;
module.exports.EventsModel = EventsModel;