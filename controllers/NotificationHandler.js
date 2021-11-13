const { SocketControl } = require("./SocketControl");
var mongoose = require('mongoose');

require("../models/User");
require("../models/Admin");

var User = mongoose.model("User");
var Admin = mongoose.model("Admin");

const NotificationHandler = {
    notify: {
        all: async (data) => {
            data.time = new Date();
            var _updNotification = await User.updateMany({}, { $push: { notifications: data } });
            if (_updNotification.acknowledged) {
                console.log("Notification for all pushed");
            }
            else {
                console.log("error updating all users' notification");
                console.log(_updNotification);
            }
            SocketControl.notify.all(data)
        },
        one: async (data, user) => {
            data.time = new Date();
            try {
                var _updNotification = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                        notifications: data
                    }
                });
                if (_updNotification.acknowledged) {
                    console.log("Notification for one pushed");
                }
                else {
                    console.log("error updating users notification");
                }
                SocketControl.notify.one(data, user);
            }
            catch (e) {
                console.log(e);
            }
        },
        admin: async (data, user) => {
            if(user){
                try{
                    var _updNotification = await User.findOneAndUpdate({username : user},{
                        $push : {
                            notifications : data
                        }
                    })
                    
                }
                catch(e){
                    console.log(e);
                }
            }
            var _adminNotification = await Admin.updateMany({},{
                $push : {
                    notifications : data
                }
            })
            SocketControl.notify.admin(data, user);
        }
    }
}

exports.NotificationHandler = NotificationHandler