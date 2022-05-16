const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const createError = require("http-errors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the bcrypt salt rounds
    let user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });


    if (user) {
      res.status(201).json({
        message: "New user created!",
        user
      });
    }

    res.redirect("signin");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  res.accessToken = await jwt.signAccessToken(user);

  return res;
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw createError.NotFound("User not registered");
  }
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) {
    throw createError.Unauthorized("Email address or password not valid");
  }

  delete user.password;
  const accessToken = await jwt.signAccessToken(user);

  if (checkPassword)
  res.header('Authorization', accessToken);
    res.status(200).json({
      message: "Login success!",
      user: user.email
    });

  return { ...user, accessToken };
};


const getUserProfile = async (req, res) => {
  const token = req.header("Authorization")
  const decoded = jwt.decode(token);

  const userId = decoded.payload.id;
  const id = userId;
  
  const user = await prisma.user.findUnique({where: {
    id
  }});

  try {
      res.status(200).json({message: "Success", user: user})
  } catch (e) {
     res.status(401).json({message: "Not authorized"})
  }
}


module.exports = { registerUser, loginUser, getUserProfile };
