import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, trim: true },
    programme: { type: String, trim: true },
    year: { type: String, trim: true },
    semester: { type: String, required: true, trim: true },
    section: { type: String, default: "A", trim: true },
    groupType: { type: String, enum: ["full_section", "sub_group", "lab_batch", "elective", "specialization"], default: "full_section" },
    groupName: { type: String, default: "All", trim: true },
    day: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    facultyName: { type: String, trim: true },
    room: { type: String, trim: true },
    isEditableByHod: { type: Boolean, default: true },
  },
  { timestamps: true }
);

timetableSchema.index({ department: 1, programme: 1, year: 1, semester: 1, section: 1, groupType: 1, groupName: 1 });
timetableSchema.index({ faculty: 1 });
timetableSchema.index({ day: 1, startTime: 1 });

export default mongoose.model("Timetable", timetableSchema);
