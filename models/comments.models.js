const db = require("../db/connection.js");
const { checkExists } = require("../db/seeds/utils.js");

exports.removeCommentById = (commentId) => {
  return checkExists("comments", "comment_id", commentId).then(() => {
    return db
      .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
        commentId,
      ])
      .then((comment) => {
        return comment.rows[0];
      });
  });
};
