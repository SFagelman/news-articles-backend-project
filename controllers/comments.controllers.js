const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then((comment) => {
      if (comment.comment_id == commentId) {
        res.status(204).send();
      }
    })
    .catch(next);
};
