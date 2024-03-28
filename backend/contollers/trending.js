const blogModel = require("../models/posts");
const trending = (req, res) => {
  const limit = 5;
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personal_info.username personal_info.profile_img personal_info.fullname -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .limit(limit)
    .select("blogId title publishedAt -_id")
    .then((data) => res.json({ message: data }))
    .catch((err) => res.json({ message: err.message }));
};
module.exports = trending;
