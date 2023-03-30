//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
});

// const userSchema = {
//   email: String,
//   password: String,
// };
//for encryption
//add .gitignore and add .env file in it before commiting

// console.log(process.env.SECRET) we can print secret using this
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
//defining a secret for encrypion

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

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
    password: req.body.password,
  });
  await newUser
    .save()
    .then(() => res.render("secrets"))
    .catch((err) => console.log(err));
});
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
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
