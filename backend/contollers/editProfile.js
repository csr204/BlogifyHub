const userModel = require("../models/user");
const editProfile = (req, res) => {
  const { username } = req.body;
  // console.log(username);
  userModel
    .findOne({ "personal_info.username": username })
    .then((user) => {
      // console.log(user);
      return res.status(200).json({ message: user });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = editProfile;
