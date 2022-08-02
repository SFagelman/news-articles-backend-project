const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectUsers,
} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => res.status(200).send({ topics }))
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

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};
