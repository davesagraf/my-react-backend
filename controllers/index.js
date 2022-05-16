const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const userService = require("../services/userService");
const postService = require("../services/postService");


//register user
router.post("/auth/sign_up", userService.registerUser);

//login user
router.post("/auth/sign_in", userService.loginUser);

//get user profile
router.get("/user/profile/", auth, userService.getUserProfile);

//add post
router.post("/posts/add", auth, postService.addPost);

//get all posts
router.get("/posts/all", auth, postService.getAllPosts);

//get posts with limit from request
router.get("/posts/all/:lim", auth, postService.getPostsWithLimit);

//add comment
router.post("/comments/add", auth, postService.addComment);

module.exports = router;