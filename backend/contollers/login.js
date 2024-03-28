const usermodel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const formatData = require("../utils/format");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({ message: "All fields are required" });
  }
  try {
    const user = await usermodel.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(500).json({ message: "user doesn't exist" });
    }
    // console.log(user);
    if (user.google_auth) {
      return res.status(403).json({
        message: "Account was regsitered using google so continue with that",
      });
    }
    const isCorrect = await bcrypt.compare(
      password,
      user.personal_info.password
    );
    if (!isCorrect) {
      return res.status(500).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ payload: user._id }, process.env.SECRET);
    const data = formatData(user, token);
    return res.json({ message: data }).status(200);
  } catch (err) {
    console.log(err);
    return res.json({ message: "error" }).status(500);
  }
};
module.exports = login;
