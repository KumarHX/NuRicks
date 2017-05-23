/**
 * Created by pranavkumar on 3/09/17.
 */

/**
 * Class used for connecting sequelize to the database
 */

var braintree = require("braintree");

var Sequelize = require('sequelize');

//var sequelize = new Sequelize('nuricks', 'root', '11fire', {
  //  host: 'localhost',
    //port: 3306,
    //dialect: 'mysql'
//});

console.log("THE DB URL: " + process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  console.log("bye");
   	sequelize = new Sequelize('heroku_f977afeb1c6b388','b23108dd5dd017','60376603', {
    	host: 'us-cdbr-iron-east-03.cleardb.net',
    	port: process.env.PORT,
    	dialect: 'mysql'
	});
} 
else {
	console.log("hello233333333");
  // the application is executed on the local machine
  sequelize = new Sequelize('nuricks', 'root', '11fire', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});
}


var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "6mds2v6f73hfcfsk",
    publicKey: "zmtn35tv9cxdm5p2",
    privateKey: "046fdb57dd2a1eb574d1ddce58b1b2bf"
});


sequelize.sync();

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
module.exports.gateway = gateway;
