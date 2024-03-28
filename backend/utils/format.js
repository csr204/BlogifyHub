const formatData = (newUser, token) => {
  return {
    token: token,
    user: {
      username: newUser.personal_info.username,
      email: newUser.personal_info.email,
      profile_img: newUser.personal_info.profile_img,
    },
  };
};

module.exports = formatData;
