const blogModel = require("../models/posts");
const getLatest = (req, res) => {
  let total;
  const blogLimit = 5;
  const page = req.params.page;
  // console.log(page);
  blogModel.countDocuments({ draft: false }).then((result) => {
    total = result;
  });
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personal_info.username personal_info.profile_img personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .skip(5 * (page - 1))
    .limit(blogLimit)
    .select("blogId title banner des tags publishedAt activity")
    .then((data) => {
      return res
        .status(200)
        .json({ message: data, totalPages: Math.ceil(total / 5) });
    })
    .catch((err) => res.status(500).json({ message: err }));
};
module.exports = getLatest;
