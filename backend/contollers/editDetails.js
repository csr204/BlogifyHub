const userModel = require("../models/user");
const editDetails = (req, res) => {
  const bioLimit = 150;
  const { payload: user } = req.user;
  const { bio, username, social_links } = req.body;
  console.log(user);
  if (username.length < 3) {
    return res
      .status(403)
      .json({ message: "username must contain atleast 3 letters" });
  }
  if (bio.length > bioLimit) {
    return res
      .status(403)
      .json({ message: `bio must not exceed ${bioLimit} charcters` });
  }
  //   console.log(username, bio, social_links);
  //social links check
  let socialLinksArr = Object.keys(social_links); //arr which contains only keys
  //   console.log(socialLinksArr);
  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      // console.log(social_links[socialLinksArr[i]]);
      if (social_links[socialLinksArr[i]].length) {
        let hostname = new URL(social_links[socialLinksArr[i]]).hostname;
        // console.log(hostname);
        //hostname of personal website can be anything so skip
        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          //error
          return res.status(403).json({
            message: `Invalid link provided for ${socialLinksArr[i]}`,
          });
        }
      }
    }
  } catch (err) {
    return res.status(403).json({ message: `Links must include http(s)` });
  }
  //update in db
  userModel
    .findOneAndUpdate(
      { _id: user },
      {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links,
      },
      {
        runValidators: true,
      }
    )
    .then((user) => {
      // console.log(username);
      return res.status(200).json({ message: username });
    })
    .catch((err) => {
      if (err.code == 11000) {
        return res.status(409).json({ message: "Username already taken" });
      } else return res.status(500).json({ message: err.message });
    });
};
module.exports = editDetails;
