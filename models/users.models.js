const db = require("../db/connection.js");
const { checkExists } = require("../db/seeds/utils.js");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => users.rows);
};

exports.selectUserByUsername = (userName) => {
  return checkExists("users", "username", userName).then(() => {
    return db
      .query("SELECT * FROM users WHERE username = $1;", [userName])
      .then((user) => user.rows[0]);
  });
};
