const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const createError = require("http-errors");
const { response } = require("express");

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

//need to change this to work with prisma
passport.use(
  new LocalStrategy(function (email, password, cb) {
    db.users.findByUsername(email, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

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
  // passport.authenticate("local", { failureRedirect: "/signin" }),
  //   (req, res) => {
  //     res.redirect("main");
  //   };

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
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

// const getUsers = async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// };

module.exports = { registerUser, loginUser };
