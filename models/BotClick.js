var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var botClick = new Schema({
    username: { type: String },
    status: { type: String },
    msg : {type : String},
    time : {type : Date},
    nextBotClick : {type : Date}
});
module.exports = mongoose.model("BotClick", botClick)