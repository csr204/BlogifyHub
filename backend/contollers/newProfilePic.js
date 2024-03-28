const userModel = require("../models/user");
const newProfileImg = (req, res) => {
  const { payload: user } = req.user;
  const { img } = req.body;
  // console.log(user, img);
  userModel
    .findOneAndUpdate({ _id: user }, { "personal_info.profile_img": img })
    .then((user) => {
      // console.log(user);
      const {
        personal_info: { profile_img },
      } = user;
      return res.status(200).json({ message: profile_img });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = newProfileImg;
