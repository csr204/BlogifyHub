const blogModel = require("../models/posts");

const getByCategory = async (req, res) => {
  const query = req.params.query;
  const blogLimit = 5;
  const page = req.params.page;

  try {
    // Use await to get the resolved value of totalPages
    const totalPages = await blogModel.countDocuments({
      ["title"]: new RegExp(query, "i"),
    });

    // Continue with fetching data
    const data = await blogModel
      .find({ title: new RegExp(query, "i"), draft: false })
      .populate(
        "author",
        "personal_info.username personal_info.profile_img personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .limit(blogLimit)
      .skip(5 * (page - 1))
      .select("blogId title banner des tags publishedAt activity -_id");

    return res
      .status(200)
      .json({ message: data, totalPages: Math.ceil(totalPages / 5) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = getByCategory;
