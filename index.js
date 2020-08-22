// Require dependencies
const puppeteer = require("puppeteer");
const Login = require("./pages/Login");
const StudentTimeTable = require("./pages/StudentTimeTable");
const { generateTimeline, generateTimelineByDay } = require("./util/timeline");

// Main

class StudentAPI {
  // Khởi tạo
  constructor(opts = {}) {
    this._opts = opts;
    this._user = null;
  }

  // Kiểm tra user có tồn tại không => boolean
  get isAuthenticated() {
    return !!this._user;
  }
  // Trả về user
  get user() {
    return this._user;
  }

  // Khởi chạy browser
  async Browser() {
    // Nếu browser đã tồn tại thì trả về cái cũ , nếu không khởi tạo browser mới
    if (!this._browser) {
      this._browser =
        this._opts.browser || (await puppeteer.launch(this._opts.puppeteer));
    }
    return this._browser;
  }

  // Hàm đăng nhập
  async Login(user) {
    const browser = await this.Browser();
    // Nếu không phát sinh lỗi (đăng nhập thành công) thì this._user sẽ tồn tại
    try {
      await Login(browser, user);
      this._user = user;
    } catch (error) {
      throw new Error("Không thể đăng nhập");
    }
  }

  async StudentTimeTable(term) {
    const browser = await this.Browser();
    if (!this._timeTable) {
      try {
        this._timeTable = await StudentTimeTable(browser, term);
      } catch (error) {
        throw new Error("Không lấy được dữ liệu môn học");
      }
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
    const browser = await this.Browser();
    await browser.close();

    this._browser = null;
    this._user = null;
  }
}
module.exports = StudentAPI;
