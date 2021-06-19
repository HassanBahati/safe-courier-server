const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels.js");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");

const userRouter = express.Router();

//Post api/user -register new user, public

userRouter.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  //simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  //check if existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "user already exists" });
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    //generate salt for password hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },

            process.env.JWT_SECRET || "bahati",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;

              res.json({
                token,
                user: { id: user.id, user: user.name, email: user.email },
              });
            }
          );
        });
      });
    });
  });
});

//Post api/user - auth user, public

userRouter.post("/log-in", (req, res) => {
  const { name, email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  //check if existing user
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "user doesnot exists" });
    }

    //validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "invalid credentials" });

      jwt.sign(
        { id: user.id },

        process.env.JWT_SECRET || "bahati",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: { id: user.id, user: user.name, email: user.email },
          });
        }
      );
    });
  });
});

// Get api /user
// get user data private

userRouter.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});

module.exports = userRouter;
