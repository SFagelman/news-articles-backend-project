const express = require("express");

const { getApi } = require("./controllers/api.controllers");

const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticles,
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controllers");

const { getUsers } = require("./controllers/users.controllers");

const { deleteCommentById } = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

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
