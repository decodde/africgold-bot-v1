const Bot = {
    creator : {type : String},
    created : {type : String},
    botClicks : {type : Number},
    nextBotClick : {type : Date},
    prevBotClick : {type : Date},
    africUsername : {type : String},
    africPassword : {type : String},
    notifications : {type : Array, default : []}
}

exports.Bot = Bot;