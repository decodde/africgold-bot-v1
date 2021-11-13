var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var admin = new Schema({
    username: { type: String },
    password: { type: String },
    
    apiKey : {type : String},
   
    botStarted : {type : Boolean, default : false},
    africUsername : {type : String},
    africPassword : {type : String},
    notifications : {type : Array, default : []}
});
module.exports = mongoose.model("Admin", admin)