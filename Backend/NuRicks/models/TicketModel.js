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

    numberSold:{type: Sequelize.INTEGER, allowNull: false, default:0},
    isGlobal:{type: Sequelize.BOOLEAN, allowNull: false}
});


Musicians.belongsToMany(Events, { through: Tickets });
Events.belongsToMany(Musicians, { through: Tickets });

Tickets.sync();

TicketsModel = {

	createTicket: function(res, fields){
        Tickets.create(fields).then(function(results){
            res.json({
                status:1, Ticket: results
            })
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
    }

};

module.exports.Tickets = Tickets;
module.exports.TicketsModel = TicketsModel;