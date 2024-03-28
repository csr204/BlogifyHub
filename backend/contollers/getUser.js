const userModel = require("../models/user");
const getUser = (req, res) => {
  const { username } = req.params;
  // console.log(username);

  userModel
    .findOne({ "personal_info.username": username })
    .then((details) => {
      // console.log(details);
      const requiredResults = {
        personal_info: details.personal_info,
        accounts: details.social_links,
        info: details.account_info,
      };
      res.json({ message: requiredResults });
    })
    .catch((e) => {
      return res.json({ error: e.message });
    });
};
module.exports = getUser;
