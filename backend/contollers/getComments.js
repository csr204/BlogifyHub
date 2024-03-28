const commentModel = require("../models/comments");
const getComments = (req, res) => {
  const { blog_id, skip } = req.body;
  const maxLimit = 5;
  commentModel
    .find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    )
    .skip(skip)
    .sort({ commentedAt: -1 })
    .limit(maxLimit)
    .then((comments) => {
      return res.status(200).json({ message: comments });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = getComments;
