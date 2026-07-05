import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: String,

    type: {
      type: String,
      enum: ["post", "note", "event", "announcement", "assignment"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "academic",
        "cultural",
        "sports",
        "nss",
        "ncc",
        "placement",
        "exam",
        "library",
        "hostel",
        "club",
        "department",
        "general",
      ],
      default: "general",
    },

    noticeType: String,
    eventDate: String,
    eventTime: String,
    venue: String,
    deadline: String,

    department: String,
    programme: String,
    year: String,
    semester: String,
    section: String,
    course: String,
    subject: String,
    unit: String,

    visibility: {
      type: String,
      enum: ["all", "department", "class", "selected", "community"],
      default: "all",
    },

    targetDepartments: [String],
    targetProgrammes: [String],
    targetYears: [String],
    targetSemesters: [String],
    targetSections: [String],
    targetCourses: [String],
    targetSubjects: [String],
    targetCommunity: String,

    approvalRoute: {
      type: String,
      default: "general_admin",
    },
    assignedReviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    fileUrl: String,
    fileName: String,
    fileType: String,
    fileSize: Number,

    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    remarks: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

contentSchema.index({ status: 1, type: 1, department: 1, programme: 1, year: 1, semester: 1 });
contentSchema.index({ submittedBy: 1, createdAt: -1 });
contentSchema.index({ assignedReviewer: 1, status: 1 });

export default mongoose.model("Content", contentSchema);
