//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const bcrypt = require("bcrypt");
const saltRounds = 10;
//for a common string , verytime you generate hash it will be same
const mongoose = require("mongoose");
const ejs = require("ejs");
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
});

// const userSchema = {
//   email: String,
//   password: String,
// };
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
//defining a secret for encrypion

const User = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/register", function (Req, res) {
  res.render("register");
});
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", async function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    await newUser
      .save()
      .then(() => res.render("secrets"))
      .catch((err) => console.log(err));
  });
});
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  await User.findOne({ email: username }).exec(function (err, foundUser) {
    if (err) {
      return handleError(err);
    } else if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result == true) {
          res.render("secrets");
        }
      });
    }
  });
});

// app.post("/login", async function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   User.find({ email: username })
//     .then((res) => {
//       if (res.password === password) {
//         res.render("secrets");
//       }
//     })
//     .catch((err) => {
//       console.log("no matches");
//     });
// });

app.listen(3000, function () {
  console.log("Server Started");
});
