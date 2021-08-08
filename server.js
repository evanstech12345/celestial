if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//const User = require("./model/User");
const Joi = require("@hapi/joi");
// const router = require('express').Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const https = require("https");
const bodyParser = require("body-parser");
let LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const nasaApiKey = process.env.NASA_KEY
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const initilizePassport = require('./passport.config')
// initilizePassport(passport,
//     email => users.find(user => user.email === email)
// )

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/front/public")));
app.use(express.static(path.join(__dirname, "/front/public/images")));
app.use(
   bodyParser.urlencoded({
      extended: true,
   })
);

// app.use(express.urlencoded({ extended: false }))
// app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
// }))
// app.use(passport.initialize())
// app.use(passport.session)
dotenv.config();
//connect to db
const UURI = mongoose.connect(
   process.env.DB_CONNECT,
   { useUnifiedTopology: true, useNewUrlParser: true },
   () => {
      console.log("db is connected");
   }
);

const loginSchema = new mongoose.Schema({
   email: String,
   password: String,
});
const User = mongoose.model("User", loginSchema);

//import routes
// const authRoute = require('./routes/auth')

// get routes

// var bodyParser = require('body-parser')
const { registerValidation, loginValidation } = require("./validation");
// const passport = require('passport');

app.get("/register", (req, res) => {
   res.render(__dirname + "/front/frontend/signup.ejs");
});
/*app.post("/register", async (req, res) => {
      const { error } = registerValidation(req.body);
      if (error) return res.status(400);
   //    Check if the user is already in the db
   const emailExist = await User.findOne({
      email: req.body.email,
   });
   if (emailExist !== []) return res.status(400).send("email already exists");
   const nameExist = await User.findOne({
      name: req.body.name,
   });
   if (nameExist) return res.status(400).send("name already exists");
   //hash the password
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(req.body.password, salt);

   //create a new user
   const user = new User({
      email: req.body.email,
      password: hashPassword,
   });
   try {
      const savedUser = await user.save();
      res.send(savedUser);
   } catch (err) {
      res.status(400).send(err);
   }
});*/
app.post("/register", function (req, res) {
   if (req.body.email !== "" && req.body.password !== "") {
      User.findOne({ email: req.body.email }, function (err, user) {
         if (err) {
            res.send("you got an error");
         } else {
            if (user) {
               res.send("this email exists");
            } else {
               bcrypt.hash(req.body.password, 10, function (err, hash) {
                  if (err) {
                     res.send("you got an error");
                  } else {
                     const user = new User({
                        email: req.body.email,
                        password: hash,
                     });
                     user.save(function (err) {
                        if (err) {
                           res.send("you got an error");
                        } else {
                           localStorage.setItem("password", req.body.password);
                           localStorage.setItem("email", req.body.email);
                           res.redirect("/articles");
                        }
                     });
                  }
               });
            }
         }
      });
   } else {
      res.send("You have to give an email or password");
   }
});
app.post("/login", function (req, res) {
   if (req.body.email !== "" && req.body.password !== "") {
      User.findOne({ email: req.body.email }, function (err, user) {
         if (err) {
            res.send("you got an error");
         } else {
            if (!user) {
               res.send("this email does not exists");
            } else {
               bcrypt.compare(req.body.password, user.password, function (err, result) {
                  if (err) {
                     res.send("you got an error");
                  } else {
                     if (result == true) {
                        localStorage.setItem("password", req.body.password);
                        localStorage.setItem("email", req.body.email);
                        res.redirect("/articles");
                     } else {
                        res.send("password is wrong");
                     }
                  }
               });
            }
         }
      });
   } else {
      res.send("You have to give an email or password");
   }
});

//login
app.get("/login", (req, res) => {
   res.render(__dirname + "/front/frontend/login.ejs");
});
/*
app.post("/login", async (req, res) => {
   const { error } = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send("Email or password is not found");
   //if password and name is correct

   // const validName = await User.findOne({ name: req.body.name })
   // if (!validName) return res.status(400).send('Email, name, or password is not found')
   //if password and name is correct

   const validPass = await bcrypt.compare(req.body.password, user.password);
   if (!validPass) return res.status(400).send("Email or password is not found");

   //Create and assign a token
   // const token = jwt.sign(({_id: user._id}), process.env.TOKEN_SECRET)

   // res.header(('auth-token', token).send(token))
   console.log("logged in");
});*/
app.get("/", (req, res) => {
   https.get(
      "https://api.nasa.gov/planetary/apod?api_key=" + nasaApiKey + "&count=2",
      function (response) {
         response.on("data", function (data) {
            res.render(__dirname + "/front/frontend/frontPage", {
               articles: JSON.parse(data),
            });
         });
      }
   );
});
app.get("/about", (req, res) => {
   res.render(__dirname + "/front/frontend/aboutUs");
});
app.get("/articles", (req, res) => {
   User.findOne({ email: localStorage.getItem("email") }, function (err, user) {
      if (err) {
         res.send("you got an error");
      } else {
         if (!user) {
            res.redirect("/login");
         } else {
            bcrypt.compare(localStorage.getItem("password"), user.password, function (err, result) {
               if (err) {
                  res.send("you got an error");
               } else {
                  if (result == true) {
                     var buffers = [];

                     https.get(
                        "https://api.nasa.gov/planetary/apod?api_key=" + nasaApiKey + "&count=10",
                        function (response) {
                           response
                              .on("data", function (data) {
                                 buffers.push(data);
                              })
                              .on("end", function () {
                                 res.render(__dirname + "/front/frontend/allArticles", {
                                    articles: JSON.parse(Buffer.concat(buffers).toString()),
                                 });
                              });
                        }
                     );
                  } else {
                     res.redirect("/login");
                  }
               }
            });
         }
      }
   });
});
app.get("/article/:date", (req, res) => {
   User.findOne({ email: localStorage.getItem("email") }, function (err, user) {
      if (err) {
         res.send("you got an error");
      } else {
         if (!user) {
            res.redirect("/login");
         } else {
            bcrypt.compare(localStorage.getItem("password"), user.password, function (err, result) {
               if (err) {
                  res.send("you got an error");
               } else {
                  if (result == true) {
                     https.get(
                        "https://api.nasa.gov/planetary/apod?api_key=" +
                           nasaApiKey +
                           "&date=" +
                           req.params.date,
                        function (response) {
                           response.on("data", function (data) {
                              res.render(__dirname + "/front/frontend/singleArticle", {
                                 article: JSON.parse(data),
                              });
                           });
                        }
                     );
                  } else {
                     res.redirect("/login");
                  }
               }
            });
         }
      }
   });
});
// //routes middleware
// app.use('/api/user', authRoute)
// app.use('/api/login', authRoute)

app.listen(3000 || process.env.PORT, console.log("listening on port 3000"));
