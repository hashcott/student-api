const {
  account,
  password,
  btnLogin,
  userRole,
} = require("../selectors/LoginSelector");

module.exports = async (browser, user, baseURL) => {
  const { idUser, passwordUser } = user;
  // Tạo page mới
  const page = await browser.newPage();
  // Truy cập vào trang đăng nhập
  await page.goto(`${baseURL}/cmcsoft.iu.web.info/Login.aspx`);
  // Điền thông tin đăng nhập vào trong input
  await page.type(account, idUser);
  await page.type(password, passwordUser);
  // Click button đăng nhập
  await page.click(btnLogin);
  await page.waitForSelector(userRole);
  // Check xem có đăng nhập thành công hay không ?
  const element = await page.$(userRole);
  const text = await (await element.getProperty("textContent")).jsonValue();
  if (!text.length) throw new Error("Lỗi đăng nhập");
  await page.close();
};
