
require('dotenv').config();
var mongoose = require('mongoose');
const puppeteer = require('puppeteer');
//const { config } = require("./config");

const crypt = require("crypto");
const { Constants } = require("./Constants");
const { Misc } = require("./Misc");
const { NotficationHandler } = require("./NotificationHandler");
const { Response } = require("./Response");

///////////////////////////////////////////////////////////


var mongodbURL = "";

if (process.env.MODE == 'production') {
    mongodbURL = process.env.MONGO_DB_PROD;
}
else {
    mongodbURL = process.env.MONGO_DB_DEV;
}
console.log(process.env.MODE);
console.log("url: ", mongodbURL);
try {
    mongoose.connect(mongodbURL);
}
catch (error) {
    throw error;
}

require("../models/User");
require("../models/Admin");
require("../models/BotClick");

var User = mongoose.model("User");
var BotClick = mongoose.model("BotClick");
var Admin = mongoose.model("Admin");

const BotBrain = {

    actions: {
        getUser: async (username) => {
            try {
                var _req = await User.findOne({ username: username });
                return Response.success(Constants.DATA_RETRIEVE_SUCCESS, _req);
            }
            catch (e) {
                console.log(e);
                return Response.error();
            }

        },
        login: async (details) => {
            var { username, password } = details;
            var _req = await User.findOne({ username: username });
            if (_req == null) {
                return Response.error(Constants.LOGIN_FAILED);
            }
            else {
                password = await Misc.hashPassword(password);
                if (_req.password == password) {
                    return Response.success(Constants.LOGIN_SUCCESS, _req);
                }
                else {
                    return Response.error(Constants.LOGIN_FAILED);
                }
            }
        },
        register: async (details) => {
            var { username, password } = details;
            var _exist = await User.findOne({ username: username });
            //console.log(_exist);
            if (_exist == null) {

                var _findReferrer;
                var _newUser = new User();
                _newUser.username = username;
                _newUser.password = await Misc.hashPassword(password);
                _newUser.joined = new Date();
                _newUser.isSubscribed = false;
                _newUser.apiKey = await Misc.generateApiKey(username);
                _newUser.referralCode = await Misc.genId();
                try {
                    await _newUser.save();
                    return Response.success(Constants.SIGNUP_SUCCESS, _newUser);
                }
                catch (e) {
                    console.log(e);
                    return Response.error(Constants.DB_ERROR, e);
                }
            }
            else {
                return Response.error(Constants.USER_EXISTS);
            }
        },
        saveAfrigoldDetails: async (user, details) => {
            var { africUsername, africPassword } = details;
            console.log(details)
            try {
                var _req = await User.findOneAndUpdate({ username: user }, {
                    $set: {
                        africUsername: africUsername,
                        africPassword: africPassword
                    }
                })
                return Response.success(Constants.AFRIC_DETAILS_SAVED_SUCCESS);
            }
            catch (e) {
                console.log(e);
                return Response.error(Constants.AFRIC_DETAILS_SAVED_FAIL);
            }
        },
        startBot: async (username) => {
            var _req = await User.findOne({ username: username });
            var { africPassword, africUsername, botStarted } = _req;
            if (africPassword && africUsername) {
                try {
                    var botInstance = new africGoldBot(africUsername, africPassword);
                    botInstance.start();
                    return Response.success(Constants.BOT_START_SUCCESS);
                }
                catch (e) {
                    console.log(e);
                    return Response.error(Constants.BOT_START_FAIL)
                }
            }
            else {
                return Response.error(Constants.AFRIC_DETAILS_NOT_FOUND);
            }
        },
        stopBot: async (username) => {
            var _req = await User.findOne({ username: username });
            var { africPassword, africUsername, botStarted } = _req;
            if(botStarted){
                try{
                    var _upd = await User.updateOne({username : username},{$set : {
                        botStarted : false
                    }});
                    if(_upd.acknowledged){
                        return Response.success(Constants.BOT_STOP_SUCCESS);
                    }
                    else {
                        return Response.error(Constants.BOT_STOP_FAIL,Constants.DB_ERROR);
                    }
                }
                catch(e){
                    console.log(e);
                    return Response.error(Constants.BOT_STOP_FAIL);
                }
            }
            else {
                return Response.error(Constants.BOT_STOP_FAIL,"bOT NOT STARTED");
            }
        }
    }
}

class africGoldBot {
    url = {

        main: "https://africgoldm.com/",
        login: {
            url: "https://africgoldm.com/login",
            action: ""
        },
        register: "",
        mine: {
            url: "https://africgoldm.com/user/mine",
            action: "",
        },
        dashboard: "https://africgoldm.com/user/dashboard"
    }
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.browser = puppeteer.launch();

    }

    async start() {
        this.page = (await this.browser).newPage();
        (await this.page).screenshot({ path: `africgold_${this.username}_start.png` });
        this.login();
    }
    async login() {
        setInterval(async () => {
            (await this.page).screenshot({ path: `africgold_${this.username}_loginResult.png` });
        })
        await (await this.page).goto(this.url.login.url);

        await (await this.page).type('input[name=username]', this.username);
        await (await this.page).type('input[name=password]', this.password);
        this.olog("LOGGING IN WITH", ` [${this.username}<>${this.password}]`);

        //document.forms[0].elements
        setTimeout(async () => {
            var c = await (await this.page).click(".submit-btn");
            console.log("c is : ", c);
            setTimeout(() => this.minePage(), 5000);
        }, 8000);
    }
    olog(state, x) {
        console.log(`[${state}] :: ${x}`);
    }
    async minePage() {
        await (await this.page).goto(this.url.mine.url);
        setTimeout(async () => {
            const mineState = await (await this.page).$eval('.mining-state', el => el.innerText);
            // console.log(mineState);
            var mineStr = "";
            if (mineState.toLowerCase() == "mine now") {
                mineStr = "Need to Mine";
                //should cllick on mining button
                this.clickMine();
            }
            else {
                mineStr = "In mining session";
            }
            this.olog(`CHECKING MINE STATE [${this.username}] `, mineStr);
        }, 5000)

    }
    async clickMine() {
        //document.getElementsByClassName("btn-mine")[0].click
        console.log("Should click on mine");
        // this.login();
        setTimeout(async () => {
            try {
                //await (await this.page).click(".btn-mine");

                var btn = await (await this.page).$eval('.btn-mine', el => el.click());
                console.log(btn);
                //await (await this.page).click(".btn-mine");
                var now = new Date();
                let _nextClick = now.setTime(now.getTime() + (1 * 60 * 60 * 1000));
                var _update = await User.updateOne({ username: this.username }, {
                    $set: {
                        prevBotClick: new Date(),
                        nextBotClick: _nextClick,
                        botStarted: true,
                    },
                    $inc: {
                        botClicks: 1
                    }
                });

                //set timer for next click
                setTimeout(async () => {
                    await BotBrain.actions.startBot(this.username);
                },new Date(_nextClick).getTime());

                this.olog(`CLICKED MINE BUTTON [${this.username}] `, "success");
            }
            catch (e) {
                this.olog("ERROR :> ", e);
                this.olog(`CLICKED MINE BUTTON [${this.username}] `, "error");
            }
        }, 5000);
    }

}

exports.BotBrain = BotBrain;