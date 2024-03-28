const CommentModel = require("../models/comments");
const notification = require("../models/notification");
const NotificationModel = require("../models/notification");
const blogModel = require("../models/posts");
const addComment = (req, res) => {
  const { payload: user } = req.user;
  const { blog_author, comment, blog_id, replyingTo, notificationId } =
    req.body;
  console.log(notificationId);
  // console.log(req.body);
  if (!comment) {
    return res.status(400).json({ message: "Please enter the comment" });
  }
  let commentObj = {
    blog_id,
    blog_author,
    comment,
    commented_by: user,
  };
  if (replyingTo) {
    commentObj.parent = replyingTo;
    commentObj.isReply = true;
  }
  new CommentModel(commentObj)
    .save()
    .then((commentDocument) => {
      //update in blog
      // console.log(commentDocument);
      blogModel
        .findOneAndUpdate(
          { _id: blog_id },
          {
            $push: { comments: commentDocument },
            $inc: {
              "activity.total_comments": 1,
              "activity.total_parent_comments": replyingTo ? 0 : 1,
            },
          }
        )
        .then((blogDocument) => {
          //notify blog publisher
          //required props type,blog,notificaton_for,user,comment(id)
          let notificationObj = {
            blog: blog_id,
            type: replyingTo ? "reply" : "comment",
            notification_for: blog_author,
            user,
            comment: commentDocument._id,
          };
          if (notificationId) {
            notification
              .findOneAndUpdate(
                { _id: notificationId },
                { reply: commentDocument._id }
              )
              .then((notificationreply) => {
                // console.log(notificationreply);
              })
              .catch((err) => console.log(err.message));
          }
          if (replyingTo) {
            notificationObj.replied_on_comment = replyingTo;
            CommentModel.findOneAndUpdate(
              { _id: replyingTo },
              { $push: { replies: commentDocument._id } }
            )
              .then((replyDocument) => {
                notificationObj.notification_for = replyDocument.commented_by;
              })
              .catch((err) => res.status(500).json({ message: err.message }));
          }

          new NotificationModel(notificationObj)
            .save()
            .then((notification) => {
              return res.status(200).json({
                message: {
                  commentedAt: commentDocument.commentedAt,
                  replies: commentDocument.replies,
                  comment,
                  user,
                  blog_author,
                  blog_id,
                  _id: commentDocument._id,
                },
              });
            })
            .catch((err) => res.status(500).json({ message: err.message }));
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = addComment;
