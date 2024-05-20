var express = require("express");
const memberController = require("../controllers/memberController");
const { ensureAuthenticated } = require("../config/auth");
const authenticate = require("../config/auth");
var passport = require("passport");
const Member = require("../models/members");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("../config/generateTokenAndSetCookie");

var memberRouter = express.Router();
memberRouter
  .route("/")
  .get(memberController.index)
  .post(memberController.regist);
memberRouter
  .route("/login")
  .get(memberController.login)
  .post(memberController.signin);

memberRouter.route("/log-in").post(async (req, res) => {
  const { username, password } = req.body;
  const member = await Member.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    member?.password || ""
  );

  if (!member || !isPasswordCorrect)
    return res.status(400).json({ error: "Invalid username or password" });
  const token = generateTokenAndSetCookie(member._id, res);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

memberRouter.route("/logout").get(memberController.signout);
memberRouter
  .route("/dashboard")
  .get(ensureAuthenticated, memberController.dashboard);
module.exports = memberRouter;
