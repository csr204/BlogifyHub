const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message: "Token is missing" });
  }
  token = token.split(" ")[1];
  // console.log(token);
  try {
    //decoded contains payload i.e info(User's obj id) about user so we are assinging that to req.user so we can make use of it if needed in any of our controllers
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
module.exports = verify;
