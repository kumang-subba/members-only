const User = require("../models/user");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Get all posts, This is the home page

exports.home_page = asyncHandler(async (req, res, next) => {
  const [allPosts, allUsers] = await Promise.all([
    Post.find({}).populate("user").sort("-post_time").exec(),
    User.find({}),
  ]);
  res.render("index", {
    title: "Member Site",
    posts: allPosts,
    users: allUsers,
    userStatus: req.user.status,
  });
});

exports.new_post = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("message", "Message cannot me empty")
    .trim()
    .isLength({ min: 1, max: 250 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
      post_time: Date.now(),
    });

    if (!errors.isEmpty()) {
      const [allPosts, allUsers] = await Promise.all([
        Post.find({}).populate("user").sort("-post_time").exec(),
        User.find({}),
      ]);
      res.render("index", {
        title: "Member Site",
        posts: allPosts,
        users: allUsers,
        userStatus: req.user.status,
        errors: errors.array(),
      });
    } else {
      await post.save();
      res.redirect("/");
    }
  }),
];
exports.delete_post = asyncHandler(async (req, res, next) => {
  if (req.user.status !== "Admin") {
    res.redirect("/");
  } else {
    await Post.findByIdAndDelete(req.body.postId);
    res.redirect("/");
  }
});
