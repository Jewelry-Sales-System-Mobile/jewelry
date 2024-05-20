var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const memberController = require("./controllers/memberController");
const authenticate = require("./config/auth");
const Member = require("./models/members");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("./config/generateTokenAndSetCookie");

var indexRouter = require("./routes/index");
var memberRouter = require("./routes/member");
var sectionRouter = require("./routes/section");
var courseRouter = require("./routes/course");
const session = require("express-session");
const errorController = require("./controllers/error");

//     mongod --dbpath=data --bind_ip 127.0.0.1

const passport = require("passport");
const flash = require("connect-flash");
const { default: mongoose } = require("mongoose");

var app = express();
require("./config/passport")(passport);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const url = "mongodb://localhost:27017/courseDemo";
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("ok!!!!");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", memberRouter);
app.use("/sections", sectionRouter);
app.use("/api/courses", courseRouter);
app.post("/login", async (req, res) => {
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

app.use(errorController.get404);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
