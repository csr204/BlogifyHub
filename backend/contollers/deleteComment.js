const commentModel = require("../models/comments");
const notificationModel = require("../models/notification");
const blogModel = require("../models/posts");
const commentDelete = (_id) => {
  //if it is a reply
  commentModel
    .findOneAndDelete({ _id })
    .then((commentData) => {
      if (commentData.parent) {
        commentModel
          .findOneAndUpdate(
            { _id: commentData.parent },
            { $pull: { replies: _id } }
          )
          .then((data) => console.log("deleted:", data))
          .catch((err) => console.log(err.message));
      }
      // deleting notification of reply
      notificationModel
        .findOneAndDelete({ comment: _id })
        .then(() => console.log("notifaction Deleted"))
        .catch((err) => console.log(err.message));
      //  modifying notification of it's parent
      notificationModel
        .findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } })
        .then(() => console.log("notifaction updated"))
        .catch((err) => console.log(err.message));

      blogModel
        .findOneAndUpdate(
          { _id: commentData.blog_id },
          {
            $pull: { comments: _id },
            $inc: {
              "activity.total_comments": -1,
              "activity.total_parent_comments": commentData.parent ? 0 : -1,
            },
          }
        )
        .then(() => {
          //if it has replies delete all of them
          if (commentData.replies) {
            for (let i = 0; i < commentData.replies.length; i++) {
              commentDelete(commentData.replies[i]);
            }
          }
        })
        .catch((err) => console.log(err.message));
    })
    .catch((err) => console.log(err.message));
};
const deleteComment = (req, res) => {
  const { payload: user } = req.user;
  const { _id } = req.body;
  commentModel.findOne({ _id }).then((comment) => {
    if (user == comment.commented_by || user == comment.blog_author) {
      commentDelete(_id);
      return res.status(200).json({ message: "Comment deleted" });
    } else {
      return res.status(400).json({ message: "Not authorized to delete" });
    }
  });
};
module.exports = deleteComment;
