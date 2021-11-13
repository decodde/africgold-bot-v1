
const express = require("express");
const {RouteControl} = require("./controllers/RouteControl");
const {SocketControl} = require("./controllers/SocketControl");

const puppeteer = require('puppeteer');


const app = express();
var session = require('express-session');
app.use(require('body-parser')());
app.use(express.static(__dirname+"/public"));
app.set('views',__dirname+"/views");
app.set('view engine', 'pug');
app.use(session({
    maxAge: 600000,
    secret: 'siev_app',
    resave: true,
    saveUninitialized: false
  }));
/*
app.use(session({
  maxAge:600000,
  secret: 'ninchat',
  resave: true,
  saveUninitialized: false
}));
*/

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  res.header("Access-Control-Allow-Methods","PUT,DELETE,POST,GET")
  next();
});

const httpServer = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(httpServer);

app.get("/", RouteControl.page.home);;
app.get("/login", RouteControl.page.login);
app.get("/register",RouteControl.page.register);
app.get("/dashboard", RouteControl.auth,RouteControl.page.dashboard);
app.get("404", RouteControl.page['404']);
app.get("/editDetails", RouteControl.auth, RouteControl.page.editDetails);

app.post("/login", RouteControl.actions.login);
app.post("/register",RouteControl.actions.register);

app.post("/saveAfrigoldDetails", RouteControl.auth, RouteControl.actions.saveAfrigoldDetails);
app.post("/startBot", RouteControl.auth, RouteControl.actions.startBot);
app.post("/stopBot", RouteControl.auth, RouteControl.actions.stopBot);



io.on("connection", SocketControl.connection);
io.on("disconnection", SocketControl.disconnect);


httpServer.listen(process.env.PORT || 3000,async () => {
  //RouteControl.watch.signalsWatcher.start();
  console.log("AfricGold Bot Running")
})
