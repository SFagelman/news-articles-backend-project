const { checkout } = require("../app.js");
const db = require("../db/connection.js");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticles = () => {
  return db
    .query(
      'SELECT articles.*, COUNT(comment_id)::int AS "comment_count" FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;'
    )
    .then((articles) => articles.rows);
};

exports.selectArticleById = (articleId) => {
  return checkExists("articles", "article_id", articleId).then(() => {
    return db
      .query(
        'SELECT articles.*, COUNT(comment_id)::int AS "comment_count" FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
        [articleId]
      )
      .then((article) => {
        return article.rows[0];
      });
  });
};

exports.updateArticleById = (articleId, newVotes) => {
  return checkExists("articles", "article_id", articleId).then(() => {
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
        [newVotes, articleId]
      )
      .then((article) => {
        return article.rows[0];
      });
  });
};

exports.selectCommentsByArticleId = (articleId) => {
  return checkExists("articles", "article_id", articleId)
    .then(() => {
      return db.query(
        "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1",
        [articleId]
      );
    })
    .then((comments) => {
      return comments.rows;
    });
};

exports.newCommentByArticleId = (
  articleId,
  newCommentUsername,
  newCommentBody
) => {
  return checkExists("articles", "article_id", articleId).then(() => {
    return db
      .query(
        "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
        [newCommentBody, articleId, newCommentUsername]
      )
      .then((article) => {
        return article.rows[0];
      });
  });
};
