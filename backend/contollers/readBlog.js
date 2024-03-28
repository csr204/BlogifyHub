const blogModel = require("../models/posts");
const userModel = require("../models/user");
const readBlog = (req, res) => {
  const blogId = req.params.id;
  //   console.log(blogId);
  const { mode, draft } = req.body;
  // console.log(mode);
  const incrementalVal = mode === "edit" ? 0 : 1;
  blogModel
    .findOneAndUpdate(
      { blogId },
      { $inc: { "activity.total_reads": incrementalVal } }
    )
    .populate(
      "author",
      "personal_info.username personal_info.fullname personal_info.profile_img "
    )
    .select("banner blogId des content title tags activity publishedAt")
    .then((result) => {
      userModel
        .findOneAndUpdate(
          { "personal_info.username": result.author.personal_info.username },
          { $inc: { "account_info.total_reads": incrementalVal } }
        )
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
      return res.status(200).json({ message: result });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
module.exports = readBlog;
