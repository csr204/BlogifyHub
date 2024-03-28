const verify = require("../middlewares/verify");
const changePassword = require("../contollers/changePassword");
const getUser = require("../contollers/getUser");
const getUserBlogs = require("../contollers/userBlogs");
const editProfile = require("../contollers/editProfile");
const newProfileImg = require("../contollers/newProfilePic");
const editDetails = require("../contollers/editDetails");
const getAllBlogsOfUser = require("../contollers/allBlogsofUser");
const router = require("express").Router();

router.get("/getUser/:username", getUser);
router.get("/getBlogs/:id/:page", getUserBlogs);
router.post("/change-password", verify, changePassword);
router.post("/edit-profile", editProfile);
router.post("/profile-pic", verify, newProfileImg);
router.post("/edit-details", verify, editDetails);
router.post("/get-all-blogs", verify, getAllBlogsOfUser);
module.exports = router;
