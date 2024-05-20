var express = require("express");
const sectionController = require("../controllers/sectionController");
const { ensureAuthenticated } = require("../config/auth");
var sectionRouter = express.Router();
sectionRouter
  .route("/")
  .get(ensureAuthenticated, sectionController.getSections);
sectionRouter
  .route("/add-section")
  .get(ensureAuthenticated, sectionController.getAddSection)
  .post(ensureAuthenticated, sectionController.postAddSection);
sectionRouter
  .route("/edit-section/:sectionId")
  .get(ensureAuthenticated, sectionController.getEditSection);
sectionRouter
  .route("/edit-section")
  .post(ensureAuthenticated, sectionController.postEditSection);

sectionRouter
  .route("/delete-product")
  .post(ensureAuthenticated, sectionController.postDeleteSection);

module.exports = sectionRouter;
