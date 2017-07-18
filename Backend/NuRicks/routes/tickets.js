var express = require('express');
var router = express.Router();
var ticket_models = require("../models/TicketModel");
var ticketModel =  ticket_models.TicketsModel;

/*
 *  Create a ticket
 *
 *  ticket_info: info to create on
 */

router.post('/createTicket', function(req, res, next){
    var ticket_info = req.body;
    var eventID = req.body.EventId;
    ticketModel.createTicket(res, ticket_info, eventID);
});

router.get('/queryGlobalTickets', function(req, res, next){
    ticketModel.queryGlobalTickets(res);
});

router.post('/updateTicketsSold', function(req, res, next){
    var id = req.body.ticketID;
    var number = req.body.numberSold;
    ticketModel.updateUserInfoScreen(res, id, number);
});


router.get('/queryTicketByMusician/:fbid', function(req, res, next){
	var search = req.params.fbid;
    ticketModel.queryTicketByMusician(res, search);
});

router.get('/queryTicketByEventID/:eventID', function(req, res, next){
	var search = req.params.eventID;
    ticketModel.queryTicketByEventID(res, search);
});

router.get('/queryTicketByTicketID/:ticketID', function(req, res, next){
    var search = req.params.ticketID;
    ticketModel.queryTicketByTicketID(res, search);
});

router.get('/allTickets', function(req, res, next){
    ticketModel.allTickets(res);
});

router.get('/deleteTicket/:ticketID', function(req, res, next){
    var search = req.params.ticketID;
    ticketModel.deleteEvent(res, search);
});


module.exports = router;
