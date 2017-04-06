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
    ticketModel.createTicket(res, ticket_info);
});

router.get('/queryGlobalTickets', function(req, res, next){
    ticketModel.queryGlobalTickets(res);
});

router.get('/queryTicketByMusician/:fbid', function(req, res, next){
	var search = req.params.fbid;
    ticketModel.queryTicketByMusician(res, search);
});

router.get('/queryTicketByMusicianURL/:url', function(req, res, next){
	var search = req.params.url;
    ticketModel.queryTicketByMusicianURL(res, search);
});

router.get('/allTickets', function(req, res, next){
    ticketModel.allTickets(res);
});


module.exports = router;
