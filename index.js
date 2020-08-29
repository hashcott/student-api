// Require dependencies
const puppeteer = require("puppeteer");
const Login = require("./pages/Login");
const StudentTimeTable = require("./pages/StudentTimeTable");
const StudyRegister = require("./pages/StudyRegister");
const StudentMark = require("./pages/StudentMark");

const { generateTimeline, generateTimelineByDay } = require("./util/timeline");

// Main

class StudentAPI {
  // Khởi tạo
  constructor() {
    this._user = null;
    this._browser = null;
    this._timeTable = null;

    //Config by user
    this._puppeteer = undefined;
    this._browserOfUser = undefined;
    this._baseURL = undefined;
  }

  config(cfg) {
    this._puppeteer = cfg.puppeteer || null;
    this._baseURL = cfg.baseURL || null;
    this._browserOfUser = cfg.browser || null;
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
  async browser() {
    if (typeof this._baseURL === "undefined") {
      throw new Error("Vui lòng nhập địa chỉ web trường");
    }
    // Nếu browser đã tồn tại thì trả về cái cũ , nếu không khởi tạo browser mới
    if (!this._browser) {
      if (this._browserOfUser) {
        this._browser = this._browserOfUser;
      } else if (this._puppeteer) {
        this._browser = await puppeteer.launch(this._puppeteer);
      } else {
        this._browser = await puppeteer.launch();
      }
    }
    return this._browser;
  }

  // Hàm đăng nhập
  async login(user) {
    try {
      const browser = await this.browser();
      // Nếu không phát sinh lỗi (đăng nhập thành công) thì this._user sẽ tồn tại
      const name = await Login(browser, user, this._baseURL);
      this._user = { name, id: user.idUser, password: user.passwordUser };
    } catch (error) {
      throw new Error("Không thể đăng nhập");
    }
  }

  //Thời khóa biểu
  async studentTimeTable(term) {
    if (!this.isAuthenticated) {
      throw new Error("Bạn chưa đăng nhập");
    }
    if (!this._timeTable) {
      try {
        const browser = await this.browser();
        this._timeTable = await StudentTimeTable(browser, term, this._baseURL);
      } catch (error) {
        throw new Error("Không lấy được dữ liệu môn học");
      }
    }
    return this._timeTable;
  }
  async studyRegister() {
    if (!this.isAuthenticated) {
      throw new Error("Bạn chưa đăng nhập");
    }
    if (!this._timeTable) {
      try {
        const browser = await this.browser();
        this._timeTable = await StudyRegister(browser, this._baseURL);
      } catch (error) {
        throw new Error("Không lấy được dữ liệu môn học");
      }
    }
    return this._timeTable;
  }

  get timeLineByDay() {
    if (!this._timeTable) throw new Error("Chưa có dữ liệu môn học");
    let timelines = generateTimeline(this._timeTable);
    let days = generateTimelineByDay(timelines);
    return days;
  }

  // Điểm số
  async getMarks(term = "---") {
    if (!this.isAuthenticated) {
      throw new Error("Bạn chưa đăng nhập");
    }
    try {
      let marks = await StudentMark(this._browser, this._baseURL, term);
      return marks;
    } catch (error) {
      throw new Error("Không lấy được dữ liệu điểm số");
    }
  }
  async close() {
    const browser = await this.browser();
    await browser.close();
    this._browser = null;
    this._user = null;
  }
}
module.exports = StudentAPI;
