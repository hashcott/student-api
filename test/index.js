const test = require("ava");
const StudentAPI = require("../");

test("basic", (t) => {
  const api = new StudentAPI();
  t.is(api.isAuthenticated, false);
  t.is(api.user, null);
});

test("authenicated", async (t) => {
  const api = new StudentAPI();
  const user = { idUser: "", passwordUser: "" };
  await api.Login(user);
  t.is(api.isAuthenticated, true);
  t.is(api.user, user);
});

test("getStudentTimeTable", async (t) => {
  const api = new StudentAPI();
  const user = { idUser: "", passwordUser: "" };
  await api.Login(user);
  const lich = await api.StudentTimeTable("2_2019_2020");
  t.is(api.isAuthenticated, true);
  t.is(api.user, user);
  t.is(!!lich.length, true);
});
