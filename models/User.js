var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
    username: { type: String },
    password: { type: String },
    botClicks : {type : Number},
    nextBotClick : {type : Date},
    prevBotClick : {type : Date},
    joined : {type : Date},
    apiKey : {type : String},
    isSubscribed : {type : Boolean, default : false},
    detailsCorrect : {type : Boolean, default : false},
    subType : {type : String},
    subExpiry : {type : Date},
    subTime : {type :  Date},
    otp : {type : Number},
    botStarted : {type : Boolean, default : false},
    africUsername : {type : String},
    africPassword : {type : String},
    notifications : {type : Array, default : []}
});
module.exports = mongoose.model("User", user)