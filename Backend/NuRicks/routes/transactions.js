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
    TransactionModel.initiateTransaction(res, params)
});

module.exports = router;