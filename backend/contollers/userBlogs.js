const userModel = require("../models/user");
// const blogModel = require("../models/posts");
const getUserBlogs = (req, res) => {
  const username = req.params.id;
  const page = req.params.page;
  // console.log(username, page);
  const maxLimit = 3;
  let total_blogs = 0;
  userModel
    .findOne({ "personal_info.username": username })
    .populate({
      path: "blogs",
      select: "blogId des activity banner title content -_id",
      match: { draft: false },
    })
    .then((result) => {
      total_blogs = result ? result.blogs.length : null;
      // console.log(total_blogs);
      userModel
        .findOne({ "personal_info.username": username })
        .populate({
          path: "blogs",
          select: "blogId des activity banner title content -_id",
          match: { draft: false },
          options: { limit: maxLimit, skip: maxLimit * (page - 1) },
        })
        .sort({ publishedAt: -1 })
        .select("blogs -_id")
        .then((result) => {
          // console.log(result);
          // console.log(Math.ceil(total_blogs / maxLimit));
          return res.status(200).json({
            blogs: result,
            totalPages: Math.ceil(total_blogs / maxLimit),
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    });
};

module.exports = getUserBlogs;
