const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formatData = require("../utils/format");
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const fullNameGenerator = (username) => {
  const randomCount = Math.floor(Math.random() * 5) + 1;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const inputArray = username.split("");
  for (let i = 0; i < randomCount; i++) {
    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    inputArray.push(randomChar);
  }
  console.log(inputArray);
  const resultString = inputArray.join("");
  console.log("resultString:" + resultString);
  return resultString;
};
const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.json({ message: "fill all details" }).status(403);
  }
  if (fullname.length < 3) {
    return res
      .json({ message: "username must be atleast 3 characters" })
      .status(403);
  }
  if (!emailRegex.test(email)) {
    return res.json({ message: "Enter a valid email" }).status(403);
  }
  if (!passwordRegex.test(password)) {
    return res
      .json({
        message:
          "password must be 6-20 letters long with atleast one numeric,upperCase",
      })
      .status(403);
  }
  const modifiedPassword = await bcrypt.hash(password, 10);
  //new user document
  const username = fullNameGenerator(fullname);
  const personal_info = {
    fullname,
    username,
    email,
    password: modifiedPassword,
  };
  try {
    await usermodel.create({
      personal_info,
    });
    const newUser = await usermodel.findOne({
      "personal_info.email": email,
    });
    // console.log(newUser);
    const token = jwt.sign({ payload: newUser._id }, process.env.SECRET);
    const data = formatData(newUser, token);
    res.json({ message: data }).status(200);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.json({ message: "Account already exists" }).status(500);
    }
    return res.json({ message: "something went wrong" }).status(500);
  }
};
module.exports = register;
