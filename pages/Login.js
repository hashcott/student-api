const delay = require("delay");
const LoginSelector = require("../selectors/LoginSelector");

module.exports = async (browser, user, opts) => {
  const page = await browser.newPage();
  await page.goto("http://dkh.tlu.edu.vn/cmcsoft.iu.web.info/Login.aspx");
  await page.type(LoginSelector.id, user.id);
  await page.type(LoginSelector.pass, user.pass);
  await page.click(LoginSelector.login);
  await page.waitForSelector("#footer_1");
  const element = await page.$("#PageHeader1_lblUserRole");
  const text = await (await element.getProperty("textContent")).jsonValue();
  if (text.length == 0) {
    throw new Error("Lỗi đăng nhập");
  }
  await page.close();
};
