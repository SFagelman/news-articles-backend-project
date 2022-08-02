const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");

const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
});

//////////////////////////////////

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
  }
});

module.exports = app;
