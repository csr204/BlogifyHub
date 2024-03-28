const userModel = require("../models/user");
const getRelatedUsers = async (req, res) => {
  //get searched user
  const user = req.params.user;
  //   console.log(user);
  let resultArray = [];
  let detailsObj = {};
  const limit = 5;
  const page = req.params.page;
  //find user in db and send personal_deatils obj
  try {
    const totalDocs = await userModel.countDocuments({
      ["personal_info.username"]: new RegExp(user, "i"),
    });
    const userInfoInDB = await userModel
      .find({
        ["personal_info.username"]: new RegExp(user, "i"),
      })
      .skip(limit * (page - 1))
      .limit(limit);
    if (!userInfoInDB || userInfoInDB.length === 0) {
      return res.status(200).json({
        message: `No users found with user name:${user}`,
        totalPages: 0,
      });
    }
    for (let i = 0; i < userInfoInDB.length; i++) {
      detailsObj = {
        personal_info: userInfoInDB[i].personal_info,
        info: userInfoInDB[i].account_info,
        id: userInfoInDB[i]._id,
      };
      resultArray.push(detailsObj);
    }
    return res
      .status(200)
      .json({ message: resultArray, totalPages: Math.ceil(totalDocs / 5) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports = getRelatedUsers;
