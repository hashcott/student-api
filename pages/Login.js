const {
  account,
  password,
  btnLogin,
  userName,
} = require("../selectors/LoginSelector");

module.exports = async (browser, user, baseURL) => {
  const { idUser, passwordUser } = user;
  // Tạo page mới
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet"].indexOf(request.resourceType()) != -1) {
      return request.abort();
    } else {
      return request.continue();
    }
  });
  // Truy cập vào trang đăng nhập
  await page.goto(`${baseURL}/cmcsoft.iu.web.info/Login.aspx`, {
    waitUntil: "networkidle2",
  });
  // Điền thông tin đăng nhập vào trong input
  await page.type(account, idUser);
  await page.type(password, passwordUser);
  // Click button đăng nhập
  await page.click(btnLogin);
  await page.waitForSelector(userName);
  // Check xem có đăng nhập thành công hay không ?
  const userNameElement = await page.$(userName);
  const name = await (
    await userNameElement.getProperty("textContent")
  ).jsonValue();
  if (name.trim() === "Khách") throw new Error();
  await page.close();
  return name;
};
