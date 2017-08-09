//Comment
var sequelize_modules = require("./init");

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var gateway = sequelize_modules.gateway;
var stripe = sequelize_modules.stripe;
var PERCENTAGE_FEE = 0.10;
var dateTime = require('node-datetime');

var User_models = require("./UserModel");
var Users = User_models.Users;

var Ticket_models = require("./TicketModel");
var Tickets = Ticket_models.Tickets;

var api_key = 'key-598e05ca5c82205a977e57ef4ae7f1aa';
var domain = 'nrdtickets.com';
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

    initiateTransactionSTRIPE: function(res, params, total, numberSold){
        stripe.charges.create({
        amount: total,
        currency: "usd",
        customer: params.customerId, // obtained with Stripe.js
        description: "Charge for " + params.customerId 
        }, function(err, charge) {
          // asynchronously called
            var dt = dateTime.create();
            var formatted = dt.format('Y-m-d H:M:S');
            console.log("formatted: " + formatted)
            if(charge){
                sequelize.query('INSERT INTO Transactions (customerId, isUser, transaction_id, amount, ticketId, createdAt, updatedAt) VALUES ("' + params.customerId +'", ' + params.isUser + ', \''+ charge.id +'\', '+ (total*0.01) +', '+ params.ticketId +', \'2017-04-06 07:30:28\', \'2017-04-06 07:30:28\');'
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
                  res.send({status: "1", transaction: transaction, transaction_id: charge.id});
                })
            }
            else {
                console.log("ERROR: " + err);
                res.json({status:-1, errors:['Error initializing transaction', err]})
            }
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
            var dt = dateTime.create();
            var formatted = dt.format('Y-m-d H:M:S');
            if(result.success){
                sequelize.query('INSERT INTO Transactions (customerId, isUser, transaction_id, amount, ticketId, createdAt, updatedAt) VALUES (' + params.customerId +', ' + params.isUser + ', \''+ result.transaction.id +'\', '+ total +', '+ params.ticketId +', ' + formatted + ', \'2017-04-06 07:30:28\');'
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
                  res.send({status: "1", transaction: transaction, transaction_id: result.transaction.id});
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

     sendEmail: function(res, headliner, musicianName, eventDate, doorsOpen, ageRestriction, venueName, streetName, address, eventURL, guestName, numberInParty, transaction_id, email){
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }

        var data = {
            from: 'Nuricks Ticket <postmaster@sandbox654b8cff24ea4666bdc8cb515051b085.mailgun.org>',
            to: email,
            subject: 'Test1RshigMip',
            text: 'Thank you for purchase!',
            html: '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en" style="background:#f3f3f3!important;border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"><title></title><style>@media only screen{html{min-height:100%;background:#f3f3f3}}@media only screen and (max-width:596px){.small-float-center{margin:0 auto!important;float:none!important;text-align:center!important}}@media only screen and (max-width:596px){table.body img{width:auto;height:auto}table.body center{min-width:0!important}table.body .container{width:95%!important}table.body .columns{height:auto!important;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;padding-left:16px!important;padding-right:16px!important}table.body .columns .columns{padding-left:0!important;padding-right:0!important}table.body .collapse .columns{padding-left:0!important;padding-right:0!important}th.small-6{display:inline-block!important;width:50%!important}th.small-12{display:inline-block!important;width:100%!important}.columns th.small-12{display:block!important;width:100%!important}table.menu{width:100%!important}table.menu td,table.menu th{width:auto!important;display:inline-block!important}table.menu.vertical td,table.menu.vertical th{display:block!important}table.menu[align=center]{width:auto!important}}</style><style type="text/css">:root #header + #content > #left > #rlblock_left{ display: none !important; }</style></head><body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;background:#f3f3f3!important;border:0;box-sizing:border-box;color:#0a0a0a;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:100%;font-weight:400;line-height:1;margin:0;min-width:100%;padding:0;text-align:left;vertical-align:baseline;width:100%!important" cz-shortcut-listen="true"><span class="preheader" style="border:0;color:#f3f3f3;display:none!important;font:inherit;font-size:1px;line-height:1px;margin:0;max-height:0;max-width:0;mso-hide:all!important;opacity:0;overflow:hidden;padding:0!important;vertical-align:baseline;visibility:hidden"></span><table class="body" style="Margin:0;background:#f3f3f3!important;border:0;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0!important;text-align:left;vertical-align:baseline;width:100%"><tbody><tr style="padding:0;text-align:left;vertical-align:top"><td class="center" align="center" valign="top" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><center data-parsed="" style="border:0;font:inherit;font-size:100%;margin:0;min-width:580px;padding:0;vertical-align:baseline;width:100%"><table align="center" class="container header float-center" style="Margin:0 auto;background:#f3f3f3;border:0;border-collapse:collapse;border-spacing:0;float:none;font:inherit;font-size:100%;margin:0 auto;padding:0;text-align:center;vertical-align:baseline;width:580px"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table class="row" style="border:0;border-collapse:collapse;border-spacing:0;display:table;font:inherit;font-size:100%;margin:0;padding:0;position:relative;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:16px;padding-right:16px;text-align:left;width:564px"><table style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody><tr style="padding:0;text-align:left;vertical-align:top"><th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><h1 class="text-center" style="Margin:0;Margin-bottom:10px;border:0;color:inherit;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:24pt;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;margin-top:8pt;padding:0;text-align:center;vertical-align:baseline;word-wrap:normal">Nu-Ricks Ticket Purchase Confirmation</h1></th><th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table><table align="center" class="container body-border float-center" style="Margin:0 auto;background:#fefefe;border:0;border-collapse:collapse;border-spacing:0;float:none;font:inherit;font-size:100%;margin:0 auto;padding:0!important;text-align:center;vertical-align:baseline;width:580px"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table class="row ticket" style="border:1px solid #000;border-collapse:collapse;border-spacing:0;display:table;font:inherit;font-size:100%;margin:0;max-width:200px;padding:0;position:relative;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"><table style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody><tr style="padding:0;text-align:left;vertical-align:top"><th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="32px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;hyphens:auto;line-height:32px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table><table cellspacing="0" border="0" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0 8px;text-align:left;vertical-align:baseline;width:100%"><thead style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><th style="Margin:0;color:grey;font-family:Helvetica,Arial,sans-serif;font-size:16pt;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0 8px;padding-bottom:4px;text-align:left;text-decoration:underline">Event Details</th></tr></thead><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Headliner:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' +headliner +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Support Act:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' +musicianName +'</td></tr><tr style="height:16px;padding:0;text-align:left;vertical-align:top"></tr><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Date:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' +formatDate(eventDate) +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Doors Open:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' +doorsOpen +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Age Restriction:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' + ageRestriction +'</td></tr></tbody></table><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="32px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;hyphens:auto;line-height:32px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table><ul style="border:0;font:inherit;font-size:100%;list-style:none;margin:0;padding:0 8px;vertical-align:baseline"><li style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><h3 style="Margin:0;Margin-bottom:10px;border:0;color:grey;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:16pt;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0;padding-bottom:4px;text-align:left;text-decoration:underline;vertical-align:baseline;word-wrap:normal">Venue</h3></li><li style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline">' + venueName +'</li><li style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline">' + address +'</li><li style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline">' + streetName +'</li></ul><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table><center data-parsed="" style="border:0;font:inherit;font-size:100%;margin:0;min-width:532px;padding:0;vertical-align:baseline;width:100%"><img src="'+ eventURL +'" align="center" class="float-center" style="-ms-interpolation-mode:bicubic;Margin:0 auto;border:0;clear:both;display:block;float:none;font:inherit;font-size:100%;margin:0 auto;max-width:100%;outline:0;padding:0;text-align:center;text-decoration:none;vertical-align:baseline;width:auto"></center><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table><table cellspacing="0" border="0" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0 8px;text-align:left;vertical-align:baseline;width:100%"><thead style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><th style="Margin:0;color:grey;font-family:Helvetica,Arial,sans-serif;font-size:16pt;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0 8px;padding-bottom:4px;text-align:left;text-decoration:underline">Atendee</th></tr></thead><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Name:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' + guestName +'</td></tr><tr style="padding:0;text-align:left;vertical-align:top"><td width="150" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">Number in party:</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0 8px;text-align:left;vertical-align:top;word-wrap:break-word">' +numberInParty +'</td></tr></tbody></table><div class="tear" style="border:0;border-bottom:1px dashed #000;display:block;font:inherit;font-size:100%;height:20px;margin:0;margin-top:12px;padding:0;vertical-align:baseline"></div><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table><h4 class="text-center" style="Margin:0;Margin-bottom:10px;border:0;color:inherit;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:14pt;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center;vertical-align:baseline;word-wrap:normal">Transaction ID: ' +transaction_id +'</h4></th><th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th></tr></tbody></table></th></tr></tbody></table><center data-parsed="" style="border:0;font:inherit;font-size:100%;margin:0;min-width:580px;padding:0;vertical-align:baseline;width:100%"><table align="center" class="menu float-center" style="Margin:0 auto;border:0;border-collapse:collapse;border-spacing:0;float:none;font:inherit;font-size:100%;margin:0 auto;padding:0;text-align:center;vertical-align:baseline;width:auto!important"><tbody><tr style="padding:0;text-align:left;vertical-align:top"><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12pt;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline"><tbody><tr style="padding:0;text-align:left;vertical-align:top"><th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"><a href="#" style="Margin:0;border:0;color:#2199e8;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:100%;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none;vertical-align:baseline">nuricks.com</a></th><th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"><a href="#" style="Margin:0;border:0;color:#2199e8;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:100%;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none;vertical-align:baseline">Facebook</a></th><th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"><a href="#" style="Margin:0;border:0;color:#2199e8;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:100%;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none;vertical-align:baseline">Twitter</a></th><th class="menu-item float-center" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:10px;padding-right:10px;text-align:center"><a href="#" style="Margin:0;border:0;color:#2199e8;font:inherit;font-family:Helvetica,Arial,sans-serif;font-size:100%;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none;vertical-align:baseline">(000)-000-0000</a></th></tr></tbody></table></td></tr></tbody></table></center><table class="spacer" style="border:0;border-collapse:collapse;border-spacing:0;font:inherit;font-size:100%;margin:0;padding:0;text-align:left;vertical-align:baseline;width:100%"><tbody style="border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="padding:0;text-align:left;vertical-align:top"><td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td></tr></tbody></table></td></tr></tbody></table></center></td></tr></tbody></table><!-- prevent Gmail on iOS font size manipulation --><div style="border:0;display:none;font:15px courier;font-size:100%;line-height:0;margin:0;padding:0!important;vertical-align:baseline;white-space:nowrap">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body></html>'
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
