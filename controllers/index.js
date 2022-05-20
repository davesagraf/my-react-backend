const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');
const userService = require("../services/userService");
const postService = require("../services/postService");
const commentService = require("../services/commentService");

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

//get current post
router.get("/posts/post/:id", auth, postService.getCurrentPost);

//udpate post
router.put("/posts/post/:id", auth, postService.updatePost);

//delete post
router.delete("/posts/post/:id", auth, postService.deletePost);

//add comment
router.post("/comments/add", auth, commentService.addComment);

//udpate comment
router.put("/comments/comment/:id", auth, commentService.updateComment);

//delete comment
router.delete("/comments/comment/:id", auth, commentService.deleteComment);

//like a post
router.put("/posts/like/:id", auth, postService.likePost);

//unlike a post
router.put("/posts/unlike/:id", auth, postService.unlikePost);

//like a comment
router.put("/comments/like/:id", auth, commentService.likeComment);

//unlike a comment
router.put("/comments/unlike/:id", auth, commentService.unlikeComment);

module.exports = router;