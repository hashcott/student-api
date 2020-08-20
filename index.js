// Require dependencies
const puppeteer = require("puppeteer");

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
}
module.exports = PuppeteerCMC;
