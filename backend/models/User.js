import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherChargeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "cultural",
        "sports",
        "nss",
        "ncc",
        "placement",
        "exam",
        "library",
        "hostel",
        "hod",
        "class_incharge",
        "club",
        "department",
        "general",
        "teaching",
      ],
      required: true,
    },
    department: { type: String, default: "All" },
    programme: { type: String, default: "All" },
    year: { type: String, default: "All" },
    semester: { type: String, default: "All" },
    section: { type: String, default: "All" },
    groupType: { type: String, default: "full_section" },
    groupName: { type: String, default: "All" },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicMaster" },
    subject: { type: String, default: "" },
    community: { type: String, default: "" },
    permissions: [String],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "student_admin", "teacher_admin", "teacher", "hod", "edp", "super_admin"],
      default: "student",
    },

    rollNumber: { type: String, default: "" },
    employeeId: { type: String, default: "" },

    department: String,
    programme: String,
    year: String,
    semester: String,
    section: String,
    groupType: { type: String, default: "full_section" },
    groupName: { type: String, default: "All" },
    labBatch: { type: String, default: "" },
    electiveGroup: { type: String, default: "" },
    specialization: { type: String, default: "" },
    selectedSubjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicMaster", required: true },
        subjectName: { type: String, default: "" },
        basketName: { type: String, default: "" },
        category: { type: String, default: "" },
        locked: { type: Boolean, default: true },
        selectedAt: { type: Date, default: Date.now },
        selectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    admissionYear: String,

    designation: String,
    phone: String,
    address: String,
    bio: String,
    skills: [String],
    subjects: [String],
    officeHours: String,
    qualification: String,
    experience: String,
    profilePhoto: String,

    charges: [teacherChargeSchema],

    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, department: 1, programme: 1, year: 1, semester: 1, section: 1, groupName: 1 });
userSchema.index({ rollNumber: 1 }, { sparse: true });
userSchema.index({ employeeId: 1 }, { sparse: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
