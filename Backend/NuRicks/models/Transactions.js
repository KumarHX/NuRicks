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

    customer_id:{
        type: Sequelize.STRING
    },

    amount:{
        type: Sequelize.DOUBLE
    },

    status:{
        type: Sequelize.STRING
    },

    ticketId:{
        type: Sequelize.INTEGER
    },

    serviceFeeAmount:{
        type: Sequelize.FLOAT
    } 
});

Users.belongsToMany(Tickets, { through: Transactions });
Tickets.belongsToMany(Users, { through: Transactions });


Transactions.sync();

TransactionModel = {

	 getClientToken: function(res){
        gateway.clientToken.generate({}, function (err, response) {
            res.send(response.clientToken);
        });
    },

};

module.exports.Transactions = Transactions;
module.exports.TransactionModel = TransactionModel;
