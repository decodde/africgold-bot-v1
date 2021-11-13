
const {BotBrain} = require("./BotBrain");
const RouteControl = { 
    auth : async (req,res,next) => {
        if(req.session.user){
            var {username} = req.session.user;
            var user = await BotBrain.actions.getUser(username);
            if(user.type == "success"){
                req.session.user = user.data;
                next();
            }
            else {
                next();
            }
        }
        else{
            res.render("403");
        }
    },
    page : {
        home : async (req,res) => {
            res.render("home");
        },
        login : async (req,res) => {
            res.render("login");
        },
        register : async (req,res) => {
            res.render("register");
        },
        dashboard : async (req,res) => {
            var {username} = req.session.user;
            res.render("dashboard",req.session.user);
        },
        '404' : async (req,res) => {
            res.render("404");
        },
        editDetails : async (req,res) => {
            res.render("editDetails",req.session.user);
        }
    },
    actions : {
        startMine : async (req,res) => {

        },
        login : async (req,res) => {
            var tryLogin = (await BotBrain.actions.login(req.body) );
            if(tryLogin.type == "success"){
                req.session.user = tryLogin.data;
                res.redirect("/dashboard");
            }
            else {
                res.render("login",tryLogin);
            }
        },
        register : async (req,res) => {
            var _register = await BotBrain.actions.register(req.body);
            if(_register.type == "success"){
                req.session.user = _register.data;
                res.render("dashboard",_register);
            }
            else { 
                res.render("register",_register);
            }
        },
        saveAfrigoldDetails : async (req,res) => {
            var {username} = req.session.user;
            var _save  = await BotBrain.actions.saveAfrigoldDetails(username,req.body);
            if(_save.type == "success"){
                res.render("editDetails_success",_save);
            }
            else {
                res.render("editDetails_fail",_save);
            }
        },
        startBot : async (req,res) => {
            var {username} = req.session.user;
            res.json(await BotBrain.actions.startBot(username,req.body));
        },
        stopBot : async (req,res) => {
            var {username} = req.session.user;
            res.json(await BotBrain.actions.stopBot(username, req.body));
        }
    }

}


exports.RouteControl = RouteControl;