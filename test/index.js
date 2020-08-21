const { test } = require("ava");
const StudentAPI = require("../");

test("basic", (t) => {
  const api = new StudentAPI();
  t.is(api.isAuthenticated, false);
  t.is(api.user, null);
});
