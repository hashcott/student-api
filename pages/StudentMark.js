const {
  termSelector,
  marksSelector,
  totalSelector,
} = require("../selectors/StudentMark");

module.exports = async (browser, baseURL, term) => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet"].indexOf(request.resourceType()) != -1) {
      return request.abort();
    } else {
      return request.continue();
    }
  });
  await page.goto(
    `${baseURL}/CMCSoft.IU.Web.info/StudentMark.aspx`,
    { waitUntil: "networkidle2" },
  );
  await page.type(termSelector, term);
  await page.waitForSelector(marksSelector);
  const marks = await page.evaluate(() => {
    let marks = [];
    let totals = [];
    let terms = [];
    let termHTML = [...document.querySelectorAll("#drpHK option")];
    termHTML.forEach((term) => {
      terms.push(term.textContent.trim());
    });
    let marksHTML = [...document.querySelectorAll("#tblStudentMark tr")];
    marksHTML.shift();
    marksHTML.pop();
    marksHTML.forEach((mark) => {
      let [
        STT,
        hocPhan,
        lopHocPhan,
        soTC,
        lanHoc,
        lanThi,
        diemThu,
        ,
        danhGia,
        ,
        quaTrinh,
        thi,
        TKHP,
        diemChu,
      ] = [...mark.querySelectorAll("td")].map((x) => x.innerText.trim());
      marks.push(
        {
          STT,
          hocPhan,
          lopHocPhan,
          soTC,
          lanHoc,
          lanThi,
          diemThu,
          danhGia,
          quaTrinh,
          thi,
          TKHP,
          diemChu,
        },
      );
    });
    let totalHTML = [...document.querySelectorAll("#grdResult tr")];
    totalHTML.shift();
    totalHTML.forEach((total) => {
      let [namHoc, hocKy, tbHe10, , tbHe4, , tongTC] = [
        ...total.querySelectorAll("td"),
      ].map((x) => x.innerText.trim());
      totals.push({ namHoc, hocKy, tbHe10, tbHe4, tongTC });
    });
    return { terms, totals, listMarks: marks };
  });
  await page.close();
  if (marks.listMarks.length === 0) throw new Error();
  return marks;
};
