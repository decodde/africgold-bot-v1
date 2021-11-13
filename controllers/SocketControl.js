const socketUsers = {

};
var headSock;
const SocketControl = {
    connection: async (socket) => {
        //console.log(socket);
        //console.log("herrrrrrr");
       
        socket.on("join", (data) => SocketControl.join(data, socket));
    },
    disconnect: async (socket) => {
        socketUsers.remove
    },
    auth: (socket, next) => {
        next();
    },
    join: async (data, socket) => {
        console.log("someone would love to join")
    
        var { username, action } = data;
        await SocketControl.socketUsers.add(username, socket);

    },
    socketUsers: {
        add: async (key, socket) => {
            var _find = await SocketControl.socketUsers.find(key);
            console.log("User added to socket");
            console.log(socket.id)
          
             socketUsers[key] = {
                    username: key,
                    socket: socket,
                    id: socket.id
                };
           return socketUsers;

        },
        remove: (user) => {
            delete socketUsers[user];
        },
        find: async (user) => {
            return Object.values(socketUsers).find((o) => {
                //console.log(o);
                return o.username == user;
            });
        },
        findById: async (id) => {
            return Object.values(socketUsers).find((o) => { return socketUsers[o].id == id });
        }

    },
    notify: {
        all: async (data) => {
            Object.keys(socketUsers).forEach(user => {
                socketUsers[user].socket.emit("notification", data);
            })
        },
        one: async (data, user) => {
            //console.log(user);
            //console.log(socketUsers);
            var _find = await SocketControl.socketUsers.find(user);
            console.log(_find);
            if (_find) {
                console.log("Notify user of", data);
                //console.log(socketUsers[user].socket);
                socketUsers[user].socket.emit("notification", data);
            }
            else {
                SocketControl.socketUsers.add(user)
            }
        },
        admin: async (data, user) => {
            if (user) {
                socketUsers[user].socket.emit("notification", data);
            }
            socketUser["admin"].socket.emit("notification");
        }
    }
}

exports.SocketControl = SocketControl;


/*
STANDARDS :
  =>
  DATA =>
        NOTIFICATION: {
            type : ['signal','investment','exchange','vtu'],
            msg : "'messageeee"
        }














*/