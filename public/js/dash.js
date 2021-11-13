let _url = "://localhost:8005"
let baseUrl = "http://localhost:8005";
//let baseUrl = "https://seiv.herokuapp.com";
//let _url = "://seiv.herokuapp.com:80";

let currentPage = "home";
const socket = io(`ws${_url}`);

socket.on("connection",async () => {
    console.log("connected");
})
socket.emit("join",{
    username : document.getElementById("_username").value
})
socket.on("notification", async data => {
    console.log("-===================-");
    console.log(data);
    console.log("-===================-");
    await App.logic.loadNotifications();
    cordova.plugins.notification.local.schedule({
        title: data.category,
        text: data.msg,
        foreground: true
    });
})
socket.on("testAdd", data => {
    console.log(data);
})

var api = {
    req: async (url, method, data) => {
        var apiKey;
        method ? method : method = "POST";
        //console.log(data);

        let opt = {
            headers: {
                "Content-Type": "application/json"
            },
            method: method
        }
        data ? opt.body = JSON.stringify(data) : data = "";
        
        // console.log(opt);
        try {
            let req = await fetch(`${baseUrl}/${url}`, opt);
            //let _req = await fetch(`${baseUrl}/${url}`, opt);
            //console.log(reqText);
            req = await req.json();
            return req;
        }
        catch (e) {
            console.log(e);
            return {
                type: "error",
                msg: "Network error"
            }
        }
        //console.log(req);

    },
    startBot : async (data, auth) => {
        return await api.req("startBot", null, data);
    },
    stopBot : async (data)=>{
        return await api.req("stopBot", null, data);
    }
}

var startBot = async () => {
    var _start = await api.startBot();
    console.log(_start);
    alert(_start.msg);
    setTimeout(()=>{
        window.location.reload()
    },2000);
}
var stopBot = async () => {
    var _stop = await api.stopBot();
    console.log(_stop);
    alert(_stop.msg);
}