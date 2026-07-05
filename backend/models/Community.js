import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Community", schema);
