const { selectUsers, selectUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const userName = req.params.username;
  selectUserByUsername(userName)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};
