const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const url = "https://www.surveylegend.com/survey/-Ml9alPXsJTbGRz78z-w";
//const url ="https://carte.cloud";

const _String = async () => {
    const browser = await puppeteer.launch();

    const test = async () => {

        /*var _f = await got(url);
        cheerio.load()
        const dom  = await JSDOM.fromURL(url,{pretendToBeVisual:true,  runScripts: "dangerously" , resources : "usable"});
        
        var a = dom.window.document.body.firstChild;
        console.log(a.textContent);
        dom.virtualConsole.on("jsdomError",(e)=>{
            console.log(e);
        })
        */

        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();
        await page.goto(url);
        setInterval(async () => {
            await page.screenshot({ path: 'screenshot.png' });

        })
        const reload = async () => {
            //page.deleteCookie(...page.cookies);
            await page.close();
            setTimeout(test, 2000)
        }
        const clearStorage = async () => {

        }
        const clickAnalytics = async () => {
            try {
                await page.click('#ball');
            }
            catch (e) {
                clickAnalytics();
            }
            setTimeout(reload, 5000);
        }
        const vote = async () => {
            try {
                await page.waitFor('.my-enter-button');
                await page.click('.my-enter-button');

            }
            catch (e) {
                console.log(e);
                vote();
            }
            setTimeout(clickAnalytics, 5000);
        }
        const clickUser = async (position) => {

            try {
                await page.waitFor('.response-area ul li:nth-child(28)');
                await page.click('.response-area ul li:nth-child(28)');
            }
            catch (e) {
                console.log(e);
                clickUser();
            }
            setTimeout(vote, 2000);
        }
        const start = async () => {
            setTimeout(async () => {

                await page.waitFor('.my-enter-button');
                await page.click('.my-enter-button');
                setTimeout(clickUser, 10000);
            }, 5000);
        }
        start();

    }
    test();
}
//_String();


class africGold {
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
            console.log(mineState);
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
                //                await (await this.page).click(".btn-mine");
                var btn = await (await this.page).$eval('.btn-mine', el => el.click());
                console.log(btn);
                await (await this.page).click(".btn-mine");
            }
            catch (e) {
                console.log(e);

            }
        }, 5000);
    }

}

startMine = async () => {
    var _afri = new africGold("Opefash", "fasinaopeoluwa");
    _afri.start();
}
startMine()