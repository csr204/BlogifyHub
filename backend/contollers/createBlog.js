const blogModel = require("../models/posts");
const userModel = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const create = async (req, res) => {
  // console.log(req.user);
  //req.user.payload contains author's id
  //get blog details
  // console.log(req.body);
  let { title, banner, content, des, tags, draft, id } = req.body;
  // console.log(content);
  // console.log(id);
  const { id: blog_id } = id;
  // console.log(blog_id);
  if (!title) {
    return res.json({ message: "Blog title should have at least 1 character" });
  }

  if (!banner.length) {
    return res.json({ message: "Blog must have a banner" });
  }
  if (
    (!draft && !content) ||
    (content && content.blocks && !content.blocks.length)
  ) {
    return res.json({ message: "Blog must have Some content to be published" });
  }
  if (des.length > 200) {
    return res.json({
      message: "Description must not be more than 200 charcters",
    });
  }
  if (tags.length > 10) {
    return res.json({
      message: "Should'nt have more than 10 tags",
    });
  }
  tags = tags.map((tag) => {
    return tag.toLowerCase();
  });
  if (blog_id) {
    // console.log("yes");
    // console.log(draft);
    blogModel
      .findOneAndUpdate(
        { blogId: blog_id },
        { title, des, tags, content, banner, draft: draft ? draft : false }
      )
      .then((modifiedBlog) => {
        // console.log(modifiedBlog);
        return res.status(200).json({ message: "updated" });
      })
      .catch((err) => {
        return res.status(500).json({ error: "failed to update" });
      });
  } else {
    let blogId = title.replace(/[^a-zA-Z0-9]/g, "-").trim() + uuidv4();
    // console.log(blogId);
    // return res.json({ message: "done" });

    //else store in db
    try {
      const blog = await blogModel.create({
        blogId,
        title,
        banner,
        content,
        des,
        tags,
        draft: Boolean(draft),
        author: req.user.payload,
      });
      let incrementVal = draft ? 0 : 1;
      // console.log(incrementVal);
      //find user and add this blog into his account
      const author = await userModel.findOneAndUpdate(
        {
          _id: req.user.payload,
        },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { blogs: blog._id },
        }
      );
      return res.json({ message: blog.blogId }).status(200);
    } catch (err) {
      return res.json({ message: err.message }).status(500);
    }
  }
};
module.exports = create;
