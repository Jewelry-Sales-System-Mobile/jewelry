var express = require("express");
const memberController = require("../controllers/memberController");
var router = express.Router();

router.route("/").get(memberController.index);

module.exports = router;
