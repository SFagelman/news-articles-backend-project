const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models");

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
