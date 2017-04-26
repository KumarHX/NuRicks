var sequelize_modules = require("./init");

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var gateway = sequelize_modules.gateway;
var PERCENTAGE_FEE = 0.10;

var User_models = require("./UserModel");
var Users = User_models.Users;

var Ticket_models = require("./TicketModel");
var Tickets = Ticket_models.Tickets;


var Transactions = sequelize.define("Transactions", {

    isUser:{
        type: Sequelize.BOOLEAN
    },

    TicketId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: Tickets,
            key: 'id'
        }
    },

    customerId: {
        type: Sequelize.STRING
    },

    amount:{
        type: Sequelize.DOUBLE
    },

    status:{
        type: Sequelize.STRING
    },

    serviceFeeAmount:{
        type: Sequelize.FLOAT
    },

    transaction_id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
});


Transactions.sync();

TransactionModel = {

	getClientToken: function(res){
        gateway.clientToken.generate({}, function (err, response) {
            res.send({tok: response.clientToken});
        });
    },

    initiateTransaction: function(res, params){
        gateway.transaction.sale({
            // console.log(params);
            amount: params.amount.toString(),
            customerId: params.customerId
            // serviceFeeAmount: serviceFee,
        }, function (err, result) {
            // var serviceFee = (Math.round(100*(PERCENTAGE_FEE *  parseFloat(params.amount)))/100.0).toString()
            // console.log(serviceFee);
            console.log(result.success);
            console.log(params);
            console.log("ERROR: " + err);
            console.log("RESULT: " + JSON.stringify(result));
            if(result.success){
                // Transactions.create({customerId: params.customerId,TicketId:params.ticketID,
                // transaction_id: result.transaction.id, amount: params.amount
                // }).then(function(transaction){
                // 	res.json({status: 1, "transaction": transaction})
                // })
                sequelize.query('INSERT INTO Transactions (customerId, isUser, transaction_id, amount, ticketId, createdAt, updatedAt) VALUES ("2352352", true, 7, 2, 1, \'2017-04-06 07:30:28\', \'2017-04-06 07:30:28\');'
                ).then(function(transaction) {
                    res.send({status: "1", transaction: transaction});
                });
            }
            else{
                console.log("ERROR: " + err);
                res.json({status:-1, errors:['Error initializing transaction', err]})
            }
        });
    }

};

module.exports.Transactions = Transactions;
module.exports.TransactionModel = TransactionModel;
