const notificationModel = require("../models/notification");
const getNotification = (req, res) => {
  const { payload: user } = req.user;
  notificationModel
    .exists({
      notification_for: user,
      seen: false,
      user: { $ne: user },
    })
    .then((result) => {
      //   console.log(result);
      if (result) {
        return res.status(200).json({ message: true });
      }
      return res.status(200).json({ message: false });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = getNotification;
