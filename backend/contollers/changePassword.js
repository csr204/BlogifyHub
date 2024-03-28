const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const changePassword = (req, res) => {
  const { payload: user } = req.user;
  const { currentPassword, newPassword } = req.body;
  //   console.log(user, currentPassword, newPassword);
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return res.status(403).json({
      message:
        "password must have atleast 1 capital letter,1 numeric and atleast 6 letters",
    });
  }
  userModel
    .findOne({ _id: user })
    .then(async (userDocument) => {
      const { personal_info } = userDocument;
      const { password } = personal_info;
      if (userDocument.google_auth)
        return res.status(403).json({
          message:
            "password cannot be modified,cause you signed in using google account",
        });
      const result = await bcrypt.compare(currentPassword, password);
      if (!result) {
        return res.status(403).json({ message: "Incorrect current Password" });
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      //   console.log(newHashedPassword);
      userModel
        .findOneAndUpdate(
          { _id: user },
          { "personal_info.password": newHashedPassword }
        )
        .then(() => res.status(200).json({ message: "updated" }))
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
module.exports = changePassword;
