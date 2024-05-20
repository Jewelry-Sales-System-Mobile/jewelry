const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sectionSchema = new Schema(
  {
    sectionName: { type: String, require: true },
    sectionDescription: { type: String, require: true },
    duration: { type: Number, require: true },
    isMainTask: { type: Boolean, default: false },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      require: true,
    },
  },
  { timestamps: true }
);
const Sections = mongoose.model("Sections", sectionSchema);
module.exports = Sections;
