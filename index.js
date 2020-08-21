// Require dependencies
const puppeteer = require("puppeteer");
const Login = require("./pages/Login");
const StudentTimeTable = require("./pages/StudentTimeTable");
const { generateTimeline, generateTimelineByDay } = require("./util/timeline");

// Main

class StudentAPI {
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
  async Login(user, opts = {}) {
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
    if (!this._timeTable) {
      this._timeTable = await StudentTimeTable(browser, term);
    }
    return this._timeTable;
  }
  TimeLineByDay() {
    if (!this._timeTable) throw new Error("Chưa có dữ liệu môn học");
    let timelines = generateTimeline(this._timeTable);
    let days = generateTimelineByDay(timelines);
    return days;
  }
  async Close() {
    const browser = await this.browser();
    await browser.close();

    this._browser = null;
    this._user = null;
  }
}
module.exports = StudentAPI;
