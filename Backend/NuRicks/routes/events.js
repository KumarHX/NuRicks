var express = require('express');
var router = express.Router();
var event_models = require("../models/EventModel");
var EventModel =  event_models.EventModel;


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


module.exports = router;