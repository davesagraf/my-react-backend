const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const userService = require("../services/userService");



router.post("/auth/sign_up", userService.registerUser);

router.post("/auth/sign_in", userService.loginUser);

router.get("/user/profile/", auth, userService.getUserProfile);

module.exports = router;