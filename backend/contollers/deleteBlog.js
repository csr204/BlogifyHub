const blogModel = require("../models/posts");
const userModel = require("../models/user");
const commentModel = require("../models/comments");
const notificationModel = require("../models/notification");
const deleteBlog = (req, res) => {
  const { payload: user } = req.user;
  const { blogId } = req.body;
  blogModel
    .findOneAndDelete({ blogId })
    .then((deleteBlog) => {
      //del all the notification related to the blog
      notificationModel
        .deleteMany({ blog: deleteBlog._id })
        .then(() =>
          console.log("deleted all the notification related to the blog")
        )
        .catch((err) => console.log(err.message));
      //modify user's details
      userModel
        .findOneAndUpdate(
          { _id: user },
          {
            $pull: { blogs: deleteBlog._id },
            $inc: {
              "activity_info.total_reads": -deleteBlog.activity.total_reads,
              "activity_info.total_posts": -1,
            },
          }
        )
        .then(() => console.log("modified user "))
        .catch((err) => console.log(err.message));
      //delete all the comments
      commentModel
        .deleteMany({ blog_id: deleteBlog._id })
        .then(() => console.log("deleted"))
        .catch((err) => console.log(err.message));
      return res.status(200).json({ message: "Blog is deleted" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = deleteBlog;
