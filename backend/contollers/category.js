const blogModel = require("../models/posts");
const getByCategory = (req, res) => {
  // console.log(req.params.tag);
  const tag = req.params.tag;
  const blogLimit = 5;
  const page = req.params.page;
  const id = req.params.id;
  let totalPages = 0;
  blogModel
    .countDocuments({ ["tags"]: tag, blogId: { $ne: id } })
    .then((result) => {
      totalPages = result;
    });
  blogModel
    .find({ tags: tag, draft: false, blogId: { $ne: id } })
    .populate(
      "author",
      "personal_info.username personal_info.profile_img personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .limit(blogLimit)
    .skip(5 * (page - 1))
    .select("blogId title banner des tags publishedAt activity -_id")
    .then((data) => {
      // data = data.filter((blog) => blog.blogId != id);
      return res
        .status(200)
        .json({ message: data, totalPages: Math.ceil(totalPages / 5) });
    })
    .catch((err) => res.status(500).json({ message: err }));
};
module.exports = getByCategory;
