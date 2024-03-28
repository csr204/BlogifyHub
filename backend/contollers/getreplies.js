const CommentModel = require("../models/comments");
const getReplies = (req, res) => {
  const { _id, skip } = req.body;
  // console.log(skip);
  const maxLimit = 5;
  CommentModel.findOne({ _id })
    .populate({
      path: "replies",
      options: { limit: maxLimit, skip, sort: { commentedAt: -1 } },
      populate: {
        path: "commented_by",
        select:
          "personal_info.username personal_info.fullname personal_info.profile_img",
      },
    })
    .select("replies")
    .then((comment) => {
      // console.log(comment.replies);
      res.status(200).json({ message: comment.replies });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = getReplies;
