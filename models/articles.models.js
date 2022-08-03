const db = require("../db/connection.js");

exports.selectArticles = () => {
  return db
    .query(
      'SELECT articles.*, COUNT(comment_id)::int AS "comment_count" FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;'
    )
    .then((articles) => articles.rows);
};

exports.selectArticleById = (articleId) => {
  return db
    .query(
      'SELECT articles.*, COUNT(comment_id)::int AS "comment_count" FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
      [articleId]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      } else {
        return article.rows[0];
      }
    });
};

exports.updateArticleById = (articleId, newVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVotes, articleId]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      } else {
        return article.rows[0];
      }
    });
};
