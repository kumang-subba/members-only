const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Get Log In page
exports.log_in_get = (req, res, next) => {
  res.render("login", { title: "Log in" });
};

exports.log_in_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })(req, res, next);
};

// Get for update user
exports.update_user_get = (req, res, next) => {
  res.render("update_form", { title: "Upgrade your User Status" });
};

// Post for user update
exports.update_user_post = [
  body("code", "Please enter code")
    .trim()
    .isLength({ min: 1 })
    .custom(async (value) => {
      console.log(!(value == "memberMe" || value == "adminMe"));
      if (!(value == "memberMe" || value == "adminMe")) {
        throw new Error("Invalid Code");
      }
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("update_form", {
        title: "Upgrade your User Status",
        errors: errors.array(),
      });
      return;
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        status: req.body.code == "memberMe" ? "Member" : "Admin",
      });
      res.redirect("/");
    }
  }),
];

// GET Sign up page
exports.sign_up_get = (req, res, next) => {
  res.render("sign_up_form", { title: "Sign up" });
};

// Handle Sign up post
exports.sign_up_post = [
  body("firstName", "First name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must be between 5 and 15 letters long")
    .trim()
    .isLength({ min: 5, max: 15 })
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already in use");
      }
    })
    .escape(),
  body("password", "Password cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: "Unverified",
      });

      if (!errors.isEmpty()) {
        res.render("sign_up_form", {
          title: "Sign up",
          errors: errors.array(),
        });
        return;
      }

      await user.save();
      res.redirect("/");
    });
  }),
];

// LOG OUT
exports.log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
