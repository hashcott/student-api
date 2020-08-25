const test = require("ava");
const StudentAPI = require("../");
const { isObject } = require("lodash");

test("basic", (t) => {
  const config = {
    baseURL: "http://dkh.tlu.edu.vn",
  };
  const api = new StudentAPI();
  api.config(config);
  t.is(api.isAuthenticated, false);
  t.is(api.user, null);
});

test("authenicated", async (t) => {
  const config = {
    baseURL: "http://dkh.tlu.edu.vn",
  };
  const api = new StudentAPI();
  api.config(config);
  const user = { idUser: "", passwordUser: "" };
  await api.login(user);
  t.is(api.isAuthenticated, true);
  t.is(api.user, user);
});

test("getStudentTimeTable", async (t) => {
  const config = {
    baseURL: "http://dkh.tlu.edu.vn",
  };
  const api = new StudentAPI();
  api.config(config);

  const user = { idUser: "", passwordUser: "" };
  await api.login(user);
  const lich = await api.studentTimeTable("2_2019_2020");
  t.is(api.isAuthenticated, true);
  t.is(api.user, user);
  t.is(!!lich.length, true);
});

test("getMarks", async (t) => {
  const config = {
    baseURL: "http://dkh.tlu.edu.vn",
  };
  const api = new StudentAPI();
  api.config(config);

  const user = { idUser: "", passwordUser: "" };
  await api.login(user);
  const lich = await api.getMarks();
  t.is(api.isAuthenticated, true);
  t.is(api.user, user);
  t.is(isObject(lich), true);
});
