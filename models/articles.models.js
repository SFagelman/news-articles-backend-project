const format = require("pg-format");
const db = require("../db/connection.js");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticles = (
  sortBy = "created_at",
  order = "DESC",
  topicFilter
) => {
  const validSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  if (!validSortBys.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const validOrders = ["ASC", "DESC"];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let dbQuery =
    "SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";
  if (topicFilter !== undefined) {
    dbQuery += `WHERE articles.topic = '${topicFilter}' `;
  }
  dbQuery += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;

  return db.query(dbQuery).then((articles) => {
    if (topicFilter !== "undefined" && articles.rows.length == 0) {
      return Promise.reject({ status: 404, msg: "topic not found" });
    }
    return articles.rows;
  });
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
