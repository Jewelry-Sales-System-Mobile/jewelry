const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // CSRF
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
