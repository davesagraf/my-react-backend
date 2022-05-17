const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtToken = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const addComment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  const { title, post_id } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: { title, user_id: id, post_id: JSON.parse(post_id)},
    });

    if (newComment) {
      res.status(201).json(newComment);
    }

    //   res.redirect("main");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const commentId = JSON.parse(req.params.id);

  const { title } = req.body;

  try {
    const currentComment = await prisma.comment.update({
      where: { id: commentId },
      data: { title },
    });

    if (currentComment) {
      res.status(200).json(currentComment);
    }

    // res.redirect("main");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const commentId = JSON.parse(req.params.id);

  try {
    const commentToDelete = await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).json({
      message: "Comment deleted!",
    });

    // res.redirect("main");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment
};