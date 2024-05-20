const Member = require("../models/members");
const bcrypt = require("bcrypt");
const passport = require("passport");
class MemberController {
  index(req, res) {
    res.render("register");
  }
  regist(req, res, next) {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
      });
    } else {
      Member.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
          });
        } else {
          const newMember = new Member({
            username,
            password,
          });
          //Hash password
          bcrypt.hash(newMember.password, 10, function (err, hash) {
            if (err) throw err;
            newMember.password = hash;
            newMember
              .save()
              .then((user) => {
                res.redirect("/users/login");
              })
              .catch(next);
          });
        }
      });
    }
  }
  login(req, res) {
    // console.log("test login");
    res.render("login");
  }
  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  }
  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
    });
  }

  loginJwt(req, res) {
    const { username, password } = req.body;
    try {
      const member = Member.findOne({ username });
      console.log("ok1");
      const isPasswordCorrect = bcrypt.compare(
        password,
        member?.password || ""
      );
      console.log("ok2");

      if (!member || !isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
      console.log("ok3");

      const token = generateTokenAndSetCookie(member._id, res);
      res.status(200).json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
      console.log("ok4");
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred during the login process" });
    }
  }

  dashboard(req, res) {
    res.render("dashboard");
  }
}
module.exports = new MemberController();
