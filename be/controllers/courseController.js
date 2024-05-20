const Course = require("../models/courses");

class CourseController {
  getAllCourse = async (req, res) => {
    try {
      const course = await Course.find();
      res.status(200).json(course);
    } catch (error) {
      console.error("Error getting course:", error);
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  };

  getCourseById = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  };

  createCourse = async (req, res) => {
    try {
      const { courseName, courseDescription } = req.body;
      const newCourse = new Course({
        courseName,
        courseDescription,
      });

      await newCourse.save();
      res.status(201).json({ message: "Course added successfully", newCourse });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  };

  updateCourse = async (req, res) => {
    const { courseName, courseDescription } = req.body;

    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      course.courseName = courseName || course.courseName;
      course.courseDescription = courseDescription || course.courseDescription;
      await course.save();
      res.status(200).json({ message: "Update course successfully", course });
    } catch (error) {
      res.status(500).json({ err: error.message });
      console.log("Error in updateProject: ", error.message);
    }
  };

  deleteCourseById = async (req, res) => {
    try {
      await Course.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  };
}
module.exports = new CourseController();
