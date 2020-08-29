module.exports = async (browser, baseURL) => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet"].indexOf(request.resourceType()) != -1) {
      return request.abort();
    } else {
      return request.continue();
    }
  });
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.goto(
    `${baseURL}/CMCSoft.IU.Web.info/StudyRegister/StudyRegister.aspx`,
    { waitUntil: "networkidle2" }
  );
  const timeTable = await page.evaluate(() => {
    // Lưu lại dữ liệu về lịch học các môn
    let timeTable = [];

    //Regex bóc dữ liệu ngày tháng và thời gian học
    const data_pattern = /(.+?) đến (.+?):/;
    const time_pattern = /Thứ ([0-9]) tiết ([0-9,]+?) \((.+?)\)/;
    const location_pattern = /\(([0-9])+\)\n(.+)/g;

    // Bóc dữ liệu html lịch học từng môn
    let timeTableHTML = Array.from(
      document.querySelectorAll("#gridRegistered tr")
    );
    timeTableHTML = timeTableHTML.slice(1, timeTableHTML.length - 1);

    for (let html of timeTableHTML) {
      let subjectHTML = Array.from(html.querySelectorAll("td"));
      // Chuyển dữ liệu từng môn hoc về dạng text
      let [
        STT,
        ,
        lopHocPhan,
        hocPhan,
        thoiGian,
        diaDiem,
        giangVien,
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
        giangVien,
        siSo,
        daDk,
        soTc,
        hocPhi,
        ghiChu,
      });
    }

    /* Chuyển dữ liệu thời gian từng môn học về dạng thời gian theo từng giai đoạn học  */
    timeTable.forEach((data, i) => {
      // Chuẩn hóa thời gian
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
          periods = periods.split(",").map((period) => parseInt(period));
          ranges.push({ day, periods, type });
        } while (timePhase.length > 0);
        phases.push({ start, end, ranges, location: "" });
      }

      // Chuẩn hóa địa chỉ học
      if (phases.length > 1) {
        let matches;
        do {
          let matches = location_pattern.exec(data.diaDiem);
          if (matches) {
            let [, phase, location] = matches;
            phases[+phase - 1].location = location;
          }
        } while (matches);
      } else {
        phases[0].location = data.diaDiem;
      }
      timeTable[i].thoiGian = phases;
      delete timeTable[i].diaDiem;
    });
    return timeTable;
  });
  await page.close();
  if (timeTable.length === 0) throw new Error();
  return timeTable;
};
