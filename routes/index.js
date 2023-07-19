var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");

/* GET home page. */
router.get("/", checkAuth, post_controller.home_page);

// Post for new post
router.post("/new_post", checkAuth, post_controller.new_post);

// Delete post
router.post("/", checkAuth, post_controller.delete_post);

// Get for update user
router.get("/update-user", checkAuth, user_controller.update_user_get);

// Post for update user
router.post("/update-user", checkAuth, user_controller.update_user_post);

// Logout post
router.get("/log-out", user_controller.log_out);

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}
module.exports = router;
