import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["submitted", "returned", "graded"], default: "submitted" },
    fileUrl: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    submittedAt: { type: Date, default: Date.now },
    marks: Number,
    feedback: String,
  },
  { _id: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subject: { type: String, required: true },
    department: { type: String, required: true },
    programme: String,
    year: String,
    semester: String,
    section: String,
    groupType: { type: String, default: "full_section" },
    groupName: { type: String, default: "All" },
    deadline: Date,
    fileUrl: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    maxMarks: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submissions: [submissionSchema],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

assignmentSchema.index({ department: 1, programme: 1, year: 1, semester: 1, section: 1, subject: 1 });
assignmentSchema.index({ createdBy: 1 });

export default mongoose.model("Assignment", assignmentSchema);
