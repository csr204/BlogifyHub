const router = require("express").Router();
const googleAuth = require("../contollers/googleAuth");
const login = require("../contollers/login");
const register = require("../contollers/register");
router.post("/login", login);
router.post("/register", register);
router.post("/google", googleAuth);
module.exports = router;
