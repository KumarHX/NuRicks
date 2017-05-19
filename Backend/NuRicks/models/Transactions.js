var sequelize_modules = require("./init");

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var gateway = sequelize_modules.gateway;
var PERCENTAGE_FEE = 0.10;

var User_models = require("./UserModel");
var Users = User_models.Users;

var Ticket_models = require("./TicketModel");
var Tickets = Ticket_models.Tickets;

var api_key = 'key-82b7d8d757bf41230899754267dbbcfb';
var domain = 'sandbox654b8cff24ea4666bdc8cb515051b085.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


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

    numberOfTickets:{
        type: Sequelize.INTEGER
    }
});


Transactions.sync();

TransactionModel = {

	getClientToken: function(res){
        gateway.clientToken.generate({}, function (err, response) {
            res.send({tok: response.clientToken});
        });
    },

    initiateTransaction: function(res, params, total, numberSold){
        gateway.transaction.sale({
            amount: total,
            customerId: params.customerId
        }, function (err, result) {
            console.log(result.success);
            console.log(params);
            console.log("ERROR: " + err);
            console.log("RESULT: " + JSON.stringify(result));
            if(result.success){
                sequelize.query('INSERT INTO Transactions (customerId, isUser, transaction_id, amount, ticketId, createdAt, updatedAt) VALUES (' + params.customerId +', ' + params.isUser + ', \''+ result.transaction.id +'\', '+ total +', '+ params.ticketId +', \'2017-04-06 07:30:28\', \'2017-04-06 07:30:28\');'
                ).then(function(transaction) {
                    console.log("HEEEEEEREEEEEE: " + params.ticketId)
                    Tickets.findOne({
                        where: {
                            id: parseInt(params.ticketId)
                        }
                    })
                    .then(function (editTicket) {
                        editTicket.update({
                            numberSold: numberSold + editTicket.numberSold
                        }).then(function(ticket){
                        
                        }).catch(function(err){
                            res.json({status: -1, errors: ['Unable to edit ticket info', err]});
                        });
                    }).catch(function (err) {
                    res.json({status: -1, errors: ['Unable to find ticket', err]});
                })
                  res.send({status: "1", transaction: transaction});
                })
            }
            else {
                console.log("ERROR: " + err);
                res.json({status:-1, errors:['Error initializing transaction', err]})
            }
        });
    },

    getTransactionsFromID: function(res, search){
        Transactions.findAll({
            where:{
                customerId: search
            }
        }).then( function(transaction){
            var return_transactions = [];
            for(var i = 0; i < transaction.length; i++)
            {
                console.log(i + " here");
                return_transactions.push(transaction[i].dataValues)
            }
            res.json({status: 1, transactions:return_transactions})
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find transaction', err]});
        });
    },

     sendEmail: function(res){
        var data = {
            from: 'Mailgun Sandbox <postmaster@sandbox654b8cff24ea4666bdc8cb515051b085.mailgun.org>',
            to: 'pranav98@gmail.com',
            subject: 'Hello',
            text: 'Testing some Mailgun awesomness!',
            html: '<b>Hello world ?</b>' 
        };

        mailgun.messages().send(data, function (error, body) {
            if(!error){
                console.log("success")
                res.json({status: 1})
            } else {
                res.json({status: -1, "error": error})
            }
        });
    },

};

module.exports.Transactions = Transactions;
module.exports.TransactionModel = TransactionModel;
