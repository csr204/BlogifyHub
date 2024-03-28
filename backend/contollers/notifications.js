const notificationModel = require("../models/notification");
const notifications = (req, res) => {
  const { payload: user } = req.user;
  const { filter, page, deletedDocCount } = req.body;
  console.log(filter, page, deletedDocCount);
  const maxLimit = 5;
  let totalDocs;
  let findQuery = { notification_for: user, user: { $ne: user } };
  let skipDocs = (page - 1) * maxLimit;
  if (filter != "all") {
    findQuery.type = filter;
  }
  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }
  notificationModel
    .countDocuments(findQuery)
    .then((total_count) => {
      totalDocs = total_count;
      notificationModel
        .find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("blog", "title blogId")
        .populate(
          "user",
          "personal_info.username personal_info.fullname personal_info.profile_img"
        )
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .populate("notification_for", "_id")
        .sort({ createdAt: -1 })
        .select("createdAt type seen reply")
        .then((notifications) => {
          // console.log(notifications);
          notificationModel
            .updateMany(findQuery, { seen: true })
            .skip(skipDocs)
            .limit(maxLimit)
            .then(() => {
              console.log("updated seen");
            })
            .catch((err) => console.log(err.message));
          return res
            .status(200)
            .json({ message: notifications, totalDocs, page });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = notifications;
