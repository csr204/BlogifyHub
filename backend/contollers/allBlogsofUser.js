const blogModel = require("../models/posts");
const getAllBlogsOfUser = (req, res) => {
  const { payload: user } = req.user;
  const { draft, page, deletedDocs, query } = req.body;
  const maxLimit = 5;
  const skipDocs = (page - 1) * maxLimit - deletedDocs;
  let totalDocs;
  // console.log(req.body);
  blogModel
    .countDocuments({
      author: user,
      draft,
      title: new RegExp(query, "i"),
    })
    .then((result) => {
      totalDocs = result;
      blogModel
        .find({ author: user, draft, title: new RegExp(query, "i") })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 })
        .select("title banner blogId draft des activity publishedAt")
        .then((blogs) => {
          // console.log(blogs);
          return res
            .status(200)
            .json({ message: { blogs: blogs, totalDocs: totalDocs } });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => console.log(err.message));
};
module.exports = getAllBlogsOfUser;
