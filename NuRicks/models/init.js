/**
 * Created by pranavkumar on 3/09/17.
 */

/**
 * Class used for connecting sequelize to the database
 */

var Sequelize = require('sequelize');

var sequelize = new Sequelize('nuricks', 'root', '11fire', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});


sequelize.sync();

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
