const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtToken = require("jsonwebtoken");
const createError = require("http-errors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

const addPost = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  const { title, description } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: { title, description, authorId: id },
    });

    if (newPost) {
      res.status(201).json({
        message: "New post created!",
        newPost,
      });
    }

    // res.redirect("main");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
    const token = req.header("Authorization");
    const decoded = jwtToken.decode(token);
  
    const userId = decoded.payload.id;
    const id = userId;
  
    const { title } = req.body;

    const userPost = await prisma.post.findMany({where: {
        authorId: id
      }});

    console.log(userPost)
  
    try {
      const newComment = await prisma.comment.create({
        data: { title, authorId: id, postId: userPost.id },
      });
  
      if (newComment) {
        res.status(201).json({
          message: "New comment created!",
          newComment,
        });
      }
  
    //   res.redirect("main");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



module.exports = { addPost, addComment };
