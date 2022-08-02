const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => topics.rows);
};

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
