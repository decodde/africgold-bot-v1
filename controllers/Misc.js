const crypt = require("crypto");
var mongoose = require('mongoose');


require("../models/User");
var User = mongoose.model("User");


const Misc = {
    
    generateOrderId: async (id, symbol, t, num) => {
        t ? t = t : t = new Date().getUTCMilliseconds();
        var strat = "rx";
        var rd = Math.round((Math.random() * 36 ** 4)).toString(36);
        if (num == 1) {
            strat = `${strat}One`;
        }
        else if (num == 2) {
            strat = `${strat}Two`;
        }
        else if (num == 3) {
            strat = `${strat}Three`
        }
        else if (num == 4) {
            strat = `${strat}Four`
        }
        else if (num == 5) {
            strat = `${strat}Five`
        }
        return `${strat}${id}${t}_${rd}`;

    },
    isBotExpired: async (_d, subType) => {
        var expireDays, diff, _diff;
        if (subType == 1) {
            expireDays = 7;
        }
        else if (subType == 2) {
            expireDays = 14;
        }
        else {
            expireDays = 99999999999999999999999999999999999999999;
        }
        if (_d) {
            _d = new Date(_d);
            var now = new Date();
            diff = _d - now;
            _diff = (diff / (60 * 60 * 24 * 1000)) % 365;
        }
        else {
            _diff = 9999999999999999999
        }
        if (_diff >= 0 && _diff <= expireDays) {
            return false;
        }
        else {
            return true;
        }
    },
    hashPassword: (password) => {
        var mykey = crypt.createCipher('aes-256-gcm', "seiv", null);
        var mystr = mykey.update(password, 'utf8', 'hex');
        mystr += mykey.final('hex');
        return mystr;
    },
    generateApiKey : async (email) => {
        var mykey = crypt.createCipher('aes-256-gcm', "seiv", null);
        var mystr = mykey.update(email, 'utf8', 'hex');
        mystr += mykey.final('hex');
        return mystr;
    },
    genId: async () => {
        return Math.round((Math.random() * 36 ** 7)).toString(36);
    },
    generateEarningsId : async () => {
        var _id = await Misc.genId();
        return `EAW${_id}_${new Date().getTime()}`;
    },
    generateSignalId : async () => {
        var _id = await Misc.genId();
        return `SIGNAL${_id}_${new Date().getTime()}`;
    },
    generateCustomId : async (cat) => {
        var _id = await Misc.genId();
        return `${cat}_${_id}_${new Date().getTime()}`;
    },
    generateId: async () => {
        var _id = await Misc.genId();
        var _req = await User.findOne({ referralCode : _id });
        if (_req == null) {
            return _id;
        }
        else {
            return await Misc.generateId();
        }
    },
    validateEmail : async (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    decodeApi : async (apiKey) => {
        console.log(":api ",apiKey);
        var decipher = crypt.createDecipher('aes-256-gcm', 'seiv', null)
        var plaintext = decipher.update(apiKey, 'hex', 'utf8');
        plaintext += decipher.final('utf8');
        return plaintext;
    },
    verifyAuth : async (apiKey) => {
        var _r = await User.findOne({apiKey : apiKey});
        if(_r == null){
            return {
                auth : false,
                msg : "Authentication failed"
            }
        }
        else {
            if (apiKey == _r.apiKey){
                return {
                    auth : true,
                    data : _r
                }
            }
        }
    }
}

//Misc.sendWithdrawMail("8742y8yn829u0802","ty@mail.com","728",90);
exports.Misc = Misc;