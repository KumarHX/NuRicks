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
    image_url: { type: Sequelize.STRING},
    headliner: { type: Sequelize.STRING},
    venue: { type: Sequelize.STRING },
    eventDate: { type: Sequelize.STRING, allowNull: false},
    street_name: { type: Sequelize.STRING, allowNull: false},
    zip_code:{type: Sequelize.INTEGER, allowNull: false},
    city:{type: Sequelize.STRING, allowNull: false},
    state:{type: Sequelize.STRING, allowNull: false},
    ageRequirement:{type: Sequelize.STRING, allowNull: false},
    cost:{type: Sequelize.INTEGER, allowNull: false},
    isPossibleEvent:{type: Sequelize.BOOLEAN, allowNull: false},
    details:{type: Sequelize.STRING},
    numberOfArtists:{type: Sequelize.INTEGER},
    numberNeededToSell:{type: Sequelize.INTEGER, allowNull: false}
});

Events.sync();


EventsModel = {

	 createEvent: function(res, fields){
        console.log("hello");
        Events.create(fields).then(function(results){
            console.log("success");
            res.json({
                status:1, Event: results
            })
        }).catch(function(err){
            console.log("fail " + err);
            res.json({status: -1, errors:['Unable to create this Event',err]});
        });
    },

     allEvents: function(res){
        Events.findAll({
            }).then(function(result){
            if(!result){
                res.json({status: -1, errors:['No Events']})
            }
            else
            {
                res.json({status: 1, numUsers: result.length, events: result})
            }
        }).catch(function(err){
            res.json({status: -1, errors:['Error with call', err]})
        });
     },

    queryPossibleEvents: function (res) {
        Events.findAll({
                where: {
                    isPossibleEvent: true
                }
            })
            .then(function (foundEvents) {
                var results = [];
                for (var i = 0; i < foundEvents.length; i++) {
                    var data = foundEvents[i];
                    results.push(data);
                }
                res.json({status: "1", "events": results})
            }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find events', err]});
        })
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

    //github dumb

    updateEventInfoScreen: function (res, eventID, eventName, doorsOpen, ShowStarts, image_url, headliner, venue, eventDate, zip_code, street_name, city, state, ageRequirement, cost, isPossibleEvent, details, numberNeededToSell){
        Events.findById(eventID).then(function(editEvent) {
            editEvent.update({
                eventName: eventName,
                doorsOpen:  doorsOpen,
                ShowStarts: ShowStarts,
                image_url: image_url,
                headliner: headliner,
                venue: venue,
                eventDate: eventDate,
                zip_code: zip_code,
                street_name: street_name,
                city: city,
                state: state,
                ageRequirement: ageRequirement,
                cost: cost,
                isPossibleEvent: isPossibleEvent,
                details: details,
                numberNeededToSell: numberNeededToSell
            }).then(function(eventInfo){
                res.json({status: 1, eventInfo: eventInfo});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit event info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find event', err]});
        })
    },


    hideEvent: function (res, eventID, isPossibleEvent){
        Events.findById(eventID).then(function(editEvent) {
            editEvent.update({
                isPossibleEvent: isPossibleEvent
            }).then(function(eventInfo){
                res.json({status: 1, eventInfo: eventInfo});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit event info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find event', err]});
        })
    },


    deleteEvent: function(res, eventId){
        Events.destroy({
            where: {
                id: eventId
            }
        }).then(function(eventDelete){
            res.json({status: "1", "deleted_event": eventDelete})
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to delete event', err]});
        });
    },
};


module.exports.Events = Events;
module.exports.EventsModel = EventsModel;
