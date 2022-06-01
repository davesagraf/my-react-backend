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
    const commentUser = await prisma.user.findUnique({
      where: { id: userId}
    })

    const newComment = await prisma.comment.create({
      data: { title, user_id: id, post_id: JSON.parse(post_id), user_name: commentUser.first_name },
    });

    if (newComment) {
      res.status(201).json(newComment);
    }

    //   res.redirect("main");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostComments = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const postId = JSON.parse(req.params.id);

  try {
    const postComments = await prisma.comment.findMany({
      where: {
        post_id: postId,
      }, include: { likes: true }
    });

    if (postComments) {
      res.status(200).json(postComments);
    }

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

const likeComment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const commentId = JSON.parse(req.params.id);

  try {
    const commentAlreadyLikedByUser = await prisma.commentLike.findFirst({
      where: { user_id: userId, comment_id: commentId },
     })

     if(commentAlreadyLikedByUser) {
      return res.status(400).json({message: "You already liked this comment"})
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  try {
    const likeUser = await prisma.user.findUnique({
      where: { id: userId}
    })

    const commentLike = await prisma.commentLike.create({
      data: {user_id: userId, comment_id: commentId, user_name: likeUser.first_name}
    })

    res.status(200).json({message: "Comment liked!"});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const unlikeComment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const commentId = JSON.parse(req.params.id);

  try {
    const commentAlreadyLikedByUser = await prisma.commentLike.findFirst({
      where: { user_id: userId, comment_id: commentId },
     })

     if(!commentAlreadyLikedByUser) {
      return res.status(400).json({message: "You haven't liked this comment yet"})
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  try {
    const commentAlreadyLikedByUser = await prisma.commentLike.findFirst({
      where: { user_id: userId, comment_id: commentId },
     })

     if(commentAlreadyLikedByUser) {
       const commentLikeToDelete = await prisma.commentLike.delete({
         where: {id: commentAlreadyLikedByUser.id}
       })
       return res.status(200).json({message: "Comment unliked!"});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}

const getCommentLikes = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  const commentId = JSON.parse(req.params.id);

  try {
    const commentLikes = await prisma.commentLike.findMany({
      where: {
        comment_id: commentId, user_id: userId
      }
    });

    if (commentLikes) {
      res.status(200).json([...commentLikes]);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCommentLikes = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  try {
    const allCommentLikes = await prisma.commentLike.findMany({
      where: {
        user_id: userId
      }
    });

    if (allCommentLikes) {
      res.status(200).json([...allCommentLikes]);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllComments = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwtToken.decode(token);

  const userId = decoded.payload.id;
  const id = userId;

  try {
    const allComments = await prisma.comment.findMany({
      include: { likes: true },
    });

    if (allComments) {
      res.status(200).json([...allComments]);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
  getCommentLikes,
  getAllCommentLikes,
  getAllComments
};
