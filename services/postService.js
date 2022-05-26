const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtToken = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const addPost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  const { title, description } = req.body;

  try {
    const postUser = await prisma.user.findUnique({
      where: { id: userId}
    })

    const newPost = await prisma.post.create({
      data: { title, description, user_id: userId, user_name: postUser.first_name },
      include: {likes: true, comments: true}
  });

    if (newPost) {
      res.status(201).json(newPost);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  try {
    const allPosts = await prisma.post.findMany({
      include: { comments: true, likes: true },
    });
    const posts = allPosts;

    if (allPosts) {
      res.status(200).json([...posts]);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostsWithLimit = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  const postLimit = JSON.parse(req.params.lim);

  try {
    const postsWithLimit = await prisma.post.findMany({
      take: postLimit, include: {comments: true, likes: true}
    });

    if (postsWithLimit) {
      res.status(200).json([...postsWithLimit]);
    }


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentPost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const postId = JSON.parse(req.params.id);

  try {
    const currentPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: { comments: true, likes: true }
    });

    if (currentPost) {
      res.status(200).json(currentPost);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const postId = JSON.parse(req.params.id);

  const { title, description } = req.body;

  try {
    const currentPost = await prisma.post.update({
      where: { id: postId },
      data: { title, description },
      include: {
        comments: true,
        likes: true,
      },
    });

    if (currentPost) {
      res.status(200).json(currentPost);
    }


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const postId = JSON.parse(req.params.id);

  try {
    const postToDelete = await prisma.post.delete({
      where: { id: postId },
    });

    res.status(204).json({
      message: "Post deleted!",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const postId = JSON.parse(req.params.id);

  try {
    const postAlreadyLikedByUser = await prisma.like.findFirst({
      where: { user_id: userId, post_id: postId },
     })

     if(postAlreadyLikedByUser) {
      return res.status(400).json({message: "You already liked this post"})
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  try {
    const postLikeUser = await prisma.user.findUnique({
      where: { id: userId}
    })

    const post = await prisma.like.create({
      data: {user_id: userId, post_id: postId, user_name: postLikeUser.first_name}
    })

    res.status(200).json({message: "Post liked!"});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikePost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const postId = JSON.parse(req.params.id);

  try {
    const postAlreadyLikedByUser = await prisma.like.findFirst({
      where: { user_id: userId, post_id: postId },
     })

     if(!postAlreadyLikedByUser) {
      return res.status(400).json({message: "You haven't liked this post yet"})
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  try {
    const postAlreadyLikedByUser = await prisma.like.findFirst({
      where: { user_id: userId, post_id: postId },
     })

     if(postAlreadyLikedByUser) {
       const likeToDelete = await prisma.like.delete({
         where: {id: postAlreadyLikedByUser.id}
       })
       return res.status(200).json({message: "Post unliked!"});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPostsWithLimit,
  getCurrentPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost
};
