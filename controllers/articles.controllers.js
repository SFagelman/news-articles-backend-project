const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  newCommentByArticleId,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const topicFilter = req.query.topic;

  const validQueries = ["sort_by", "order", "topic"];
  if (Object.keys(req.query).length != 0) {
    for (query in req.query) {
      if (!validQueries.includes(query)) {
        res.status(400).send({ msg: "Bad Request" });
      }
    }
  }
  selectArticles(sortBy, order, topicFilter)
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVotes = req.body.inc_votes;
  updateArticleById(articleId, newVotes)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  selectCommentsByArticleId(articleId)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const newCommentUsername = req.body.username;
  const newCommentBody = req.body.body;
  if (
    !req.body.hasOwnProperty("username") ||
    !req.body.hasOwnProperty("body")
  ) {
    res.status(400).send({ msg: "Invalid post body keys" });
  }

  if (
    typeof newCommentUsername !== "string" ||
    typeof newCommentBody !== "string"
  ) {
    res.status(400).send({ msg: "Invalid post body values" });
  }

  newCommentByArticleId(articleId, newCommentUsername, newCommentBody)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};
