/**
 * Created by Pranav Kumar on 3/09/2017.
 */

var sequelize_modules = require("./init");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
const util = require('util');

 var Admins = sequelize.define("Admins", {

    username: {
        type: Sequelize.STRING,
    },

    password: {
    	type: Sequelize.STRING,
    }
});

Admins.sync();

AdminsModel = {

	login: function(res, uname, pword){
       Admins.findOne({
            where:{
                username: uname,
                password: pword
            }
        }).then(function(adminInfo){
            if(adminInfo){
                res.json({status: "1", "adminInfo": adminInfo})
            }
            else{
                res.json({status: -1, errors: ['Admin does not exist']})
            }
        }).catch(function (err) {
            console.log("broke");
            res.json({status: -1, errors: ['Unable to find Admin', err]});
        });
    },

    createAdmin: function(res, fields){
        Admins.create(fields).then(function(result){
            res.json({
                status: 1, Admin: result
            })
        }).catch(function(err){
            	res.json({status: -1, errors: err});
    	});
    }
}


module.exports.Admins = Admins;
module.exports.AdminsModel = AdminsModel;