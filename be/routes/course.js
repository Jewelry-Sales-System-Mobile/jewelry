var express = require("express");
const courseController = require("../controllers/courseController");
const protectRoute = require("../middlewares/protectedRoute");
var courseRouter = express.Router();

courseRouter.route("/").get(courseController.getAllCourse);

courseRouter.route("/:id").get(courseController.getCourseById);

courseRouter.route("/").post(protectRoute, courseController.createCourse);

courseRouter.route("/:id").put(protectRoute, courseController.updateCourse);

courseRouter
  .route("/:id")
  .delete(protectRoute, courseController.deleteCourseById);

module.exports = courseRouter;
