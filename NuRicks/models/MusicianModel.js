/**
 * Created by Pranav Kumar on 3/09/2017.
 */

var sequelize_modules = require("./init");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

/*  Musician's model
 *
 *  email: The renter's email address.
 *      - Foreign key. (Users_Model)
 *  description: A description of the renter
 *  merchant_id: each renter has a merchant ID that is used for payments.
 *
 */

 var Musicians = sequelize.define("Musicians", {
    email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    }
});

Musicians.sync();
module.exports.Musicians = Musicians;