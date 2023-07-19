var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");

/* GET Log in page. */
router.get("/log-in", isAuthenticated, user_controller.log_in_get);

// Post Log in
router.post("/log-in", isAuthenticated, user_controller.log_in_post);

// Get Sign up page
router.get("/sign-up", isAuthenticated, user_controller.sign_up_get);

// POST for sign up
router.post("/sign-up", isAuthenticated, user_controller.sign_up_post);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
    return;
  }
  next();
}
module.exports = router;
