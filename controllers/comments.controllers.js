const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");

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

exports.patchCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  const newVotes = req.body.inc_votes;
  updateCommentById(commentId, newVotes)
    .then((comment) => res.status(200).send({ comment }))
    .catch(next);
};
