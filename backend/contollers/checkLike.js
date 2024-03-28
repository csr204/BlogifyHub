const Notification = require("../models/notification");
const checkLike = (req, res) => {
  const { _id } = req.body;
  const { payload: user } = req.user;
  // console.log(_id);
  // console.log(user);
  Notification.exists({ user, blog: _id, type: "like" })
    .then((result) => res.status(200).json({ message: result }))
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = checkLike;
