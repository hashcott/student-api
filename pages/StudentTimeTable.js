const delay = require("delay");
const StudentTimeTableSL = require("../selectors/StudentTimeTable");
const { generateTimelineByDay, generateTimeline } = require("../util/timeline");

module.exports = async (browser, term) => {
  const page = await browser.newPage();
  await page.goto(
    "http://dkh.tlu.edu.vn/CMCSoft.IU.Web.Info/Reports/Form/StudentTimeTable.aspx"
  );
  await page.type(StudentTimeTableSL.term, term);
  await page.waitForSelector(StudentTimeTableSL.table);
  const timeTable = await page.evaluate(() => {
    // Lưu lại dữ liệu về lịch học các môn
    let timeTable = [];

    //Regex bóc dữ liệu ngày tháng và thời gian học
    const data_pattern = /(.+?) đến (.+?):/;
    const time_pattern = /Thứ ([0-9]) tiết ([0-9,]+?) \((.+?)\)/;

    // Bóc dữ liệu html lịch học từng môn
    let timeTableHTML = [
      ...document.querySelectorAll("#gridRegistered tr"),
    ].slice(1, 11);

    for (let html of timeTableHTML) {
      let subjectHTML = [...html.querySelectorAll("td")];

      // Chuyển dữ liệu từng môn hoc về dạng text
      let [
        STT,
        lopHocPhan,
        hocPhan,
        thoiGian,
        diaDiem,
        siSo,
        daDk,
        soTc,
        hocPhi,
        ghiChu,
      ] = subjectHTML.map((sj) => sj.innerText.trim());

      // Lưu lại dữ liệu lịch học từng môn
      timeTable.push({
        STT,
        lopHocPhan,
        hocPhan,
        thoiGian,
        diaDiem,
        siSo,
        daDk,
        soTc,
        hocPhi,
        ghiChu,
      });
    }

    /* Chuyển dữ liệu thời gian từng môn học về dạng thời gian theo từng giai đoạn học  */
    timeTable.forEach((data, i) => {
      let getTimePhase = data.thoiGian.split("Từ");
      getTimePhase = getTimePhase.filter((time) => time != "");
      let phases = [];
      for (let time of getTimePhase) {
        let timePhase = time.split("\n");
        timePhase = timePhase.filter((time) => time !== "");
        let ranges = [];
        let [, start, end] = data_pattern
          .exec(timePhase.shift())
          .map((x) => x.trim());
        do {
          let [, day, periods, type] = time_pattern.exec(timePhase.shift());
          periods = periods.split(",");
          ranges.push({ day, periods, type });
        } while (timePhase.length > 0);
        phases.push({ start, end, ranges });
      }
      timeTable[i].thoiGian = phases;
    });
    console.log(timeTable);
    return timeTable;
  });
  await page.close();
  return timeTable;
};
