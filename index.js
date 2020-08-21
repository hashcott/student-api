// Require dependencies
const puppeteer = require("puppeteer");
const Login = require("./pages/Login");
const StudentTimeTable = require("./pages/StudentTimeTable");

// Require custom lib

// Main

class PuppeteerCMC {
  constructor(opts = {}) {
    this._opts = opts;
    this._user = null;
  }

  get isAuthenticated() {
    return !!this._user;
  }
  get user() {
    return this._user;
  }
  async browser() {
    if (!this._browser) {
      this._browser =
        this._opts.browser || (await puppeteer.launch(this._opts.puppeteer));
    }
    return this._browser;
  }
  async login(user, opts = {}) {
    const browser = await this.browser();
    try {
      await Login(browser, user, opts);
      this._user = user;
    } catch (error) {
      console.log(error.message);
    }
  }
  async StudentTimeTable(term) {
    const browser = await this.browser();
    await StudentTimeTable(browser, term);
  }
  async close() {
    const browser = await this.browser();
    await browser.close();

    this._browser = null;
    this._user = null;
  }
}
module.exports = PuppeteerCMC;
