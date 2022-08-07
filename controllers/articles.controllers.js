const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  newCommentByArticleId,
  newArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const topicFilter = req.query.topic;
  const limit = req.query.limit;

  //added limit to req.query, validQuery check

  const validQueries = ["sort_by", "order", "topic", "limit"];
  if (Object.keys(req.query).length != 0) {
    for (query in req.query) {
      if (!validQueries.includes(query)) {
        res.status(400).send({ msg: "Bad Request" });
      }
    }
  }
  selectArticles(sortBy, order, topicFilter, limit)
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

exports.postArticle = (req, res, next) => {
  const newArticleAuthor = req.body.author;
  const newArticleTitle = req.body.title;
  const newArticleBody = req.body.body;
  const newArticleTopic = req.body.topic;
  if (
    !req.body.hasOwnProperty("author") ||
    !req.body.hasOwnProperty("title") ||
    !req.body.hasOwnProperty("body") ||
    !req.body.hasOwnProperty("topic")
  ) {
    res.status(400).send({ msg: "Invalid post body keys" });
  }

  if (
    typeof newArticleAuthor !== "string" ||
    typeof newArticleTitle !== "string" ||
    typeof newArticleBody !== "string" ||
    typeof newArticleTopic !== "string"
  ) {
    res.status(400).send({ msg: "Invalid post body values" });
  }

  newArticle(newArticleAuthor, newArticleTitle, newArticleBody, newArticleTopic)
    .then((article) => res.status(201).send({ article }))
    .catch(next);
};
