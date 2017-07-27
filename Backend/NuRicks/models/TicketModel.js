/**
 * Created by Pranav Kumar on 4/01/2017.
 */

var sequelize_modules = require("./init");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
const util = require('util');
var Musician_models = require("./MusicianModel");
var Musicians = Musician_models.Musicians;
var Event_models = require("./EventModel");
var Events = Event_models.Events;

var Tickets = sequelize.define("Tickets", {
    id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    numberSold:{type: Sequelize.INTEGER, allowNull: false, default:0},
    isGlobal:{type: Sequelize.BOOLEAN, allowNull: false},
    hidden:{type: Sequelize.BOOLEAN, default:false},
});


Musicians.belongsToMany(Events, { through: Tickets });
Events.belongsToMany(Musicians, { through: Tickets });

Tickets.sync();

TicketsModel = {

	createTicket: function(res, fields, eventID){
        Tickets.create(fields).then(function(results){
             res.json({status:1, Ticket: results})
        }).catch(function(err){
            res.json({status: -1, errors:['Unable to create this Ticket',err]});
        });
    },


    queryGlobalTickets: function (res) {
        Tickets.findAll({
                where: {
                    isGlobal: true
                }
            })
            .then(function (foundTickets) {
                var results = [];
                for (var i = 0; i < foundTickets.length; i++) {
                    var data = foundTickets[i];
                    results.push(data);
                }
                res.json({status: "1", "tickets": results})
            }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find tickets', err]});
        })
    },

    allTickets: function(res){
        Tickets.findAll({
            }).then(function(result){
            if(!result){
                res.json({status: -1, errors:['No Tickets']})
            }
            else
            {
                res.json({status: 1, numUsers: result.length, tickets: result})
            }
        }).catch(function(err){
            res.json({status: -1, errors:['Error with call', err]})
        });
     },
  

    queryTicketByMusician: function (res, search) {
        Tickets.findAll({
                where: {
                    MusicianFbid: search
                }
            })
            .then(function (foundTickets) {
                var results = [];
                for (var i = 0; i < foundTickets.length; i++) {
                    var data = foundTickets[i];
                    results.push(data);
                }
                res.json({status: "1", "tickets": results})
            }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find tickets', err]});
        })
    },

    updateTicketsSold: function (res, id, number){
        Tickets.findOne({
            where:{
                id: id
            }
        }).then(function(editTicket) {
            editTicket.update({
                numberSold: number
            }).then(function(ticket){
                res.json({status: 1, ticket: ticket});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit ticket info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find ticket', err]});
        })
    },

    hideTicket: function (res, id, hide){
        Tickets.findOne({
            where:{
                id: id
            }
        }).then(function(editTicket) {
            editTicket.update({
                hidden: hide
            }).then(function(ticket){
                res.json({status: 1, ticket: ticket});
            }).catch(function(err){
                res.json({status: -1, errors: ['Unable to edit ticket info', err]});
            });
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find ticket', err]});
        })
    },

    //fixed
    hideAllTicketsForEvent: function (res, eventID, hide) {
        Events.findOne(eventID).then(function(editEvent) {
            editEvent.update({
                isPossibleEvent:hide
            }).then(function (Event) {
                Tickets.findAll({
                    where: {
                        Eventid: eventID
                    }
                }).then(function (foundTickets) {
                    var results = [];
                    for (var i = 0; i < foundTickets.length; i++) {
                        var data = foundTickets[i];
                        results.push(data);
                    }
                res.json({status: "1", "tickets": results})
                }).catch(function (err) {
                    res.json({status: -1, errors: ['Unable to find tickets', err]});
                })
            }).catch(function (err) {
                res.json({status: -1, errors: ['Unable to find tickets', err]});
            })
        }.catch(function (err) {
            res.json({status: -1, errors: ['Unable to find event', err]});
        })
    },

    queryTicketByEventID: function (res, search) {
        Tickets.findAll({
                where: {
                    EventId: search
                }
            })
            .then(function (foundTickets) {
                var results = [];
                for (var i = 0; i < foundTickets.length; i++) {
                    var data = foundTickets[i];
                    results.push(data);
                }
                res.json({status: "1", "tickets": results})
            }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find tickets', err]});
        })
    },

    queryTicketByTicketID: function (res, search) {
        Tickets.findOne({
                where: {
                    id: parseInt(search)
                }
            })
            .then(function (foundTicket) {
                res.json({status: "1", "ticket": foundTicket})
            }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to find ticket', err]});
        })
    },

    deleteTicket: function(res, ticketId){
        Tickets.destroy({
            where: {
                id: ticketId
            }
        }).then(function(ticketDelete){
            res.json({status: "1", "deleted_ticket": ticketDelete})
        }).catch(function (err) {
            res.json({status: -1, errors: ['Unable to delete ticket', err]});
        });
    },

};

module.exports.Tickets = Tickets;
module.exports.TicketsModel = TicketsModel;