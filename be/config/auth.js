var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var passport = require("passport");

var config = require("./config");
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect("/users/login");
  },
  getToken: function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
  },
};

// exports.

// exports.jwtPassport = passport.use(
//   new JwtStrategy(opts, (jwt_payload, done) => {
//     console.log("JWT payload: ", jwt_payload);
//     User.findOne({ _id: jwt_payload._id }, (err, user) => {
//       if (err) {
//         return done(err, false);
//       } else if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     });
//   })
// );

exports.verifyUser = passport.authenticate("jwt", { session: false });
