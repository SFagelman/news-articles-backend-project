const db = require("../db/connection.js");

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
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
