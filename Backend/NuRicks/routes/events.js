var express = require('express');
var router = express.Router();
var event_models = require("../models/EventModel");
var EventModel =  event_models.EventsModel;


/*
 *  Find a event
 *
 *  id: id to search on
 */

router.get('/getEventInfoFromID/:id', function(req, res, next){
    var search = req.params.id;
    EventModel.getEventInfoFromID(res, search);
});

/*
 *  Create a event
 *
 *  event_info: info to create on
 */

router.post('/createEvent', function(req, res, next){
    var event_info = req.body;
    EventModel.createEvent(res, event_info);
});

router.get('/allEvents', function(req, res, next){
    EventModel.allEvents(res);
});

router.get('/deleteEvent/:eventID', function(req, res, next){
    var search = req.params.eventID;
    EventModel.deleteEvent(res, search);
});

router.get('/queryPossibleEvents', function(req, res, next){
    EventModel.queryPossibleEvents(res);
});

router.post('/hideEvent', function(req, res, next){
    var eventID = req.body.eventID;
    var isPossibleEvent = req.body.isPossibleEvent;
    EventModel.hideEvent(res,eventID,isPossibleEvent);
});

router.post('/updateEventInfo', function(req, res, next){
    var eventID = req.body.id;
    var eventName = req.body.eventName;
    var	doorsOpen = req.body.doorsOpen;
    var	ShowStarts = req.body.ShowStarts;
    var	image_url = req.body.image_url;
    var	headliner = req.body.headliner;
    var	eventDate = req.body.eventDate;
    var	zip_code = req.body.zip_code;
    var street_name = req.body.street_name;
    var venue = req.body.venue;
    var	city = req.body.city;
    var	state = req.body.state;
    var	ageRequirement = req.body.ageRequirement;
    var cost = req.body.cost;
    var	isPossibleEvent = req.body.isPossibleEvent;
    var	details = req.body.details;
    var	numberNeededToSell = req.body.numberNeededToSell;
    var eventPaymentDescription = req.body.eventPaymentDescription;
    EventModel.updateEventInfoScreen(res, eventID, eventName, doorsOpen, ShowStarts, image_url, headliner, venue, eventDate, zip_code, street_name, city, state, ageRequirement, cost, isPossibleEvent, details, numberNeededToSell, eventPaymentDescription);
});

module.exports = router;
