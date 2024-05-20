const Section = require("../models/sections");
const Course = require("../models/courses");

exports.getSections = (req, res, next) => {
  Section.find()
    .populate("course")
    .then((sections) => {
      console.log(sections);
      res.render("sections", {
        sects: sections,
        pageTitle: "All Sections",
        path: "/all",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddSection = (req, res, next) => {
  Course.find().then((courses) => {
    res.render("edit-section", {
      courses: courses,
      pageTitle: "Add Section",
      path: "/sections/add-section",
      editing: false,
    });
  });
};

exports.postAddSection = (req, res, next) => {
  const sectionName = req.body.sectionName;
  const sectionDescription = req.body.sectionDescription;
  const duration = req.body.duration;
  const isMainTask = req.body.isMainTask === "on" ? true : false;
  const courseId = req.body.courseId;

  const section = new Section({
    sectionName: sectionName,
    sectionDescription: sectionDescription,
    duration: duration,
    isMainTask: isMainTask,
    course: courseId,
  });
  section
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/sections");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteSection = (req, res, next) => {
  const sectionId = req.body.sectionId;
  Section.findByIdAndDelete(sectionId)
    .then(() => {
      console.log("DESTROYED section");
      res.redirect("/sections");
    })
    .catch((err) => console.log(err));
};
exports.getEditSection = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const sectionId = req.params.sectionId;
  Promise.all([
    Section.findById(sectionId), // First promise: fetch the section by its ID
    Course.find(), // Second promise: fetch all courses
  ])
    .then(([section, courses]) => {
      // Destructure the results array into section and courses
      if (!section) {
        return res.redirect("/");
      }
      res.render("edit-section", {
        pageTitle: "Edit Section",
        path: "/sections/edit-section",
        editing: editMode,
        section: section,
        courses: courses, // Pass the courses to the template
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditSection = (req, res, next) => {
  const sectionId = req.body.sectionId;
  const sectionName = req.body.sectionName;
  const sectionDescription = req.body.sectionDescription;
  const duration = req.body.duration;
  const isMainTask = req.body.isMainTask === "on" ? true : false;
  const courseId = req.body.courseId;

  Section.findById(sectionId)
    .then((section) => {
      section.sectionName = sectionName;
      section.sectionDescription = sectionDescription;
      section.duration = duration;
      section.isMainTask = isMainTask;
      section.course = courseId;
      return section.save();
    })
    .then((result) => {
      console.log("UPDATED SECTION!");
      res.redirect("/sections");
    })
    .catch((err) => console.log(err));
};
