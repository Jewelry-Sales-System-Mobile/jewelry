const Member = require("../models/members");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, secretKey);

    const member = await Member.findById(decoded.userId).select("-password");

    req.member = member;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

module.exports = protectRoute;
