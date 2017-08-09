var express = require('express');
var router = express.Router();


var transaction_model = require("../models/Transactions");
var TransactionModel =  transaction_model.TransactionModel;


router.post("/sendEmail", function (req, res) {
    // setup email data with unicode symbols
    var headliner = req.body.headliner;
    var musicianName = req.body.musicianName;
    var eventDate = req.body.eventDate;
    var doorsOpen = req.body.doorsOpen;
    var ageRestriction = req.body.ageRestriction;
    var venueName = req.body.venueName;
    var streetName = req.body.streetName;
    var address = req.body.address;
    var eventURL = req.body.eventURL;
    var guestName = req.body.guestName;
    var numberInParty = req.body.numberInParty;
    var transaction_id = req.body.transaction_id;
    var email = req.body.email;
	TransactionModel.sendEmail(res,headliner, musicianName, eventDate, doorsOpen, ageRestriction, venueName, streetName, address, eventURL, guestName, numberInParty, transaction_id);
});


router.get("/getClientToken", function (req, res) {
    TransactionModel.getClientToken(res);
});

router.post("/initiateTransactionSTRIPE", function(req, res) {
    var params = req.body;
    console.log(params);
    var total = params.amount * params.numberOfTickets * 100;
    TransactionModel.initiateTransactionSTRIPE(res, params, total, parseInt(params.numberOfTickets));
});

router.post("/initiateTransaction", function(req, res) {
    var params = req.body;
    console.log(params);
    var total = params.amount * params.numberOfTickets;
    TransactionModel.initiateTransaction(res, params, total, parseInt(params.numberOfTickets));
});

router.get('/getTransactionsByID/:customerID', function(req, res, next){
    var search = req.params.customerID;
    TransactionModel.getTransactionsFromID(res, search);
});

module.exports = router;

