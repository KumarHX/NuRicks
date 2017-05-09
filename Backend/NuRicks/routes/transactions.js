var express = require('express');
var router = express.Router();


var transaction_model = require("../models/Transactions");
var TransactionModel =  transaction_model.TransactionModel;

router.get("/getClientToken", function (req, res) {
    TransactionModel.getClientToken(res);
});

router.post("/initiateTransaction", function(req, res) {
    var params = req.body;
    console.log(params);
    var total = params.amount * params.numberOfTickets;
    TransactionModel.initiateTransaction(res, params, total);
});

router.get('/getTransactionsByIDMusician/:customerID', function(req, res, next){
    var search = req.params.email;
    TransactionModel.getTransactionsFromIDMusician(res, search);
});

router.get('/getTransactionsByIDUSER/:customerID', function(req, res, next){
    var search = req.params.email;
    TransactionModel.getTransactionsFromIDUser(res, search);
});

module.exports = router;

