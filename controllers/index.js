const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const userService = require("../services/userService");

// router.get("/users", userService.getUsers);

router.post("/auth/sign_up", userService.registerUser);

router.post("/auth/sign_in", userService.loginUser);

// all users
// router.get('/', auth, user.all);

module.exports = router;