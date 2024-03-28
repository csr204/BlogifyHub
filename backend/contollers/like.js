const Notification = require("../models/notification");
const blogModel = require("../models/posts");
const likeBlog = (req, res) => {
  //for notifying the author about who has liked we need user
  const { payload: user } = req.user;
  //   console.log(user);
  const { liked, _id } = req.body;
  if (!_id) return res.json({ message: "Id is missing" });
  //react-updates take time so !liked means user has Liked the blog
  const incOrDec = !liked ? 1 : -1;
  blogModel
    .findOneAndUpdate(
      {
        _id,
      },
      { $inc: { "activity.total_likes": incOrDec } }
    )
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      if (!liked) {
        let like = new Notification({
          type: "like",
          blog: _id,
          notification_for: blog.author,
          user,
        });
        like
          .save()
          .then(() => {
            return res.status(500).json({ liked_by_user: true });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      } else {
        Notification.findOneAndDelete({ user, type: "like", blog: _id })
          .then(() => {
            return res.status(500).json({ liked_by_user: false });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
module.exports = likeBlog;
