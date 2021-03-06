//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const app = express();
const { MongoClient } = require("mongodb");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//Tested
app.get("/", function (req, res) {
  res.send("Home Page");
  //res.render("home");
});
//Tested
app.get("/login", function (req, res) {
  res.send("Login Page");
  //res.render("login");
});
//Tested
app.get("/register", function (req, res) {
  res.send("The Register Page");
  //yo
  //res.render("register");
});
//Tested
app.get("/secrets", function (req, res) {
  User.find({ secret: { $ne: null } }, function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    }
  });
});
//Tested
app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.send("Authenticated");
    // res.render("submit");
  } else {
    res.send("Login Page");
    // res.redirect("/login");
  }
});
//Tested
app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;
  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});
//Tested
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
//Tested
app.post("/register", function (req, res) {
  console.log("Register");
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).send("Something broke!");
        //res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});
//Tested
app.post("/delete", function (req, res) {
  console.log("Deleteing....");
  User.deleteOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.status(500).send("Something broke!");
    } else {
      req.logout();
      res.redirect("/");
    }
  });
});
//Tested
app.post("/login", function (req, res) {
  console.log("Login");
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Something broke!");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});
//Comment
//Tested
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started on port " + port);
});
