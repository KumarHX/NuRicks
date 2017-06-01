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

     sendEmail: function(res, headliner, musicianName, eventDate, doorsOpen, ageRestriction, venueName, streetName, address, eventURL, guestName, numberInParty, transaction_id){
        var data = {
            from: 'Nuricks Ticket <postmaster@sandbox654b8cff24ea4666bdc8cb515051b085.mailgun.org>',
            to: 'pranav98@gmail.com',
            subject: 'Test1RshigMip',
            text: 'Thank you for purchase!',
            html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <title></title></head><body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;background:#f3f3f3!important;box-sizing:border-box;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important"><span class="preheader" style="color:#f3f3f3;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;mso-hide:all!important;opacity:0;overflow:hidden;visibility:hidden"></span><table class="body" style="Margin:0;background:#f3f3f3!important;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td align="center" class="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" valign="top"> <center data-parsed="" style="min-width:580px;width:100%"> <table align="center" class="container header float-center" style="Margin:0 auto;background:#f3f3f3;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:16px;padding-right:16px;text-align:left;width:564px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <h1 class="text-center" style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:34px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center;word-wrap:normal">Nu-Ricks Ticket Stub</h1> </th> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr></tbody> </table> </th> </tr></tbody> </table> </td></tr></tbody> </table> <table align="center" class="container body-border float-center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="32px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;hyphens:auto;line-height:32px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> <h3 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;text-decoration:underline;text-decoration-color:#d31f25;word-wrap:normal">Event Details</h3> <table border="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Headliner:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +headliner +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Support Act:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +musicianName +'</td></tr><tr style="height:16px;padding:0;text-align:left;vertical-align:top"> <td></td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Date:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +eventDate +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Doors Open:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +doorsOpen +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Age Restriction:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' + ageRestriction +'</td></tr></tbody> </table> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="32px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;hyphens:auto;line-height:32px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> <h3 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;text-decoration:underline;text-decoration-color:#d31f25;word-wrap:normal">Venue:</h3> <h6 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal">' + venueName +'</h6> <h6 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal">' + streetName +'</h6> <h6 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal">' + address +'</h6> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> <center data-parsed="" style="min-width:532px;width:100%"> <img align="center" class="float-center" src=' + eventURL +' style="-ms-interpolation-mode:bicubic;Margin:0 auto;clear:both;display:block;float:none;margin:0 auto;max-width:100%;outline:0;text-align:center;text-decoration:none;width:auto"> </center> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> <h3 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;text-decoration:underline;text-decoration-color:#d31f25;word-wrap:normal">Attendee</h3> <table border="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Name:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' + guestName +'</tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" width="150">Number in party:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +numberInParty +'</td></tr></tbody> </table> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> <center data-parsed="" style="min-width:532px;width:100%"> <table align="center" class="menu float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:auto!important"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"> <a href="#" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">nuricks.com</a> </th> <th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"> <a href="#" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">Facebook</a> </th> <th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"> <a href="#" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">Twitter</a> </th> <th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"> <a href="#" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">(000)-000-0000</a> </th> </tr></tbody> </table> </td></tr></tbody> </table> </center> </th> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr></tbody> </table> </th> </tr></tbody> </table> <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody> </table> </td></tr></tbody> </table> </center> </td></tr></tbody></table> <h5 class="text-center" style="Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center;word-wrap:normal">Transaction ID:' +transaction_id +'</h5> <div style="display:none;white-space:nowrap;font:15px courier;line-height:0"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body></html>' 
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
