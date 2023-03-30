//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const md5 = require("md5");
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
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  await newUser
    .save()
    .then(() => res.render("secrets"))
    .catch((err) => console.log(err));
});
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  await User.findOne({ email: username }).exec(function (err, foundUser) {
    if (err) {
      return handleError(err);
    } else if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
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
