const { getAuth } = require("firebase-admin/auth");
const userModel = require("../models/user");
const formatData = require("../utils/format");
const jwt = require("jsonwebtoken");
const googleAuth = async (req, res) => {
  const { accessToken } = req.body.stsTokenManager;
  // console.log(accessToken);
  const user = await getAuth().verifyIdToken(accessToken);
  let { email, name, picture, email_verified } = user;
  // console.log(user);
  if (!email_verified) return res.json({ message: "Email is not verified" });
  picture = picture.replace("s96-c", "s384-c");
  const checkUser = await userModel
    .findOne({ "personal_info.email": email })
    .select(
      "personal_info.fullname personal_info.email personal_info.username personal_info.profile_img google_auth"
    );
  // console.log(checkUser);
  if (checkUser) {
    if (!checkUser.google_auth) {
      return res.status(403).json({
        message:
          "This account was signedUp with out google account so login using credentials",
      });
    } else {
      const token = jwt.sign({ payload: checkUser._id }, process.env.SECRET);
      const data = formatData(checkUser, token);
      // console.log(data);
      return res
        .json({
          message: data,
        })
        .status(200);
    }
  } else {
    //register this account
    // console.log(checkUser.google_auth);
    await userModel.create({
      personal_info: {
        email,
        fullname: name,
        username: name,
        profile_img: picture,
      },
      google_auth: true,
    });
    const user = await userModel.findOne({ "personal_info.email": email });
    const token = jwt.sign({ payload: user._id }, process.env.SECRET);
    const formatedUser = formatData(user, token);
    console.log(formatedUser);
    return res.json({ message: formatedUser });
  }
};
module.exports = googleAuth;
