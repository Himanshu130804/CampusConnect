import User from "../models/User.js";
import Content from "../models/Content.js";
import AuditLog from "../models/AuditLog.js";
import Notification from "../models/Notification.js";
import Report from "../models/Report.js";

export const getStats = async (req, res) => {
  const [
    students,
    studentAdmins,
    teacherAdmins,
    hods,
    edpUsers,
    superAdmins,
    pending,
    approved,
    rejected,
    notes,
    posts,
    events,
    announcements,
    assignments,
    reports,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "student_admin" }),
    User.countDocuments({ role: { $in: ["teacher", "teacher_admin"] } }),
    User.countDocuments({ role: "hod" }),
    User.countDocuments({ role: "edp" }),
    User.countDocuments({ role: "super_admin" }),
    Content.countDocuments({ status: "pending" }),
    Content.countDocuments({ status: "approved" }),
    Content.countDocuments({ status: "rejected" }),
    Content.countDocuments({ type: "note" }),
    Content.countDocuments({ type: "post" }),
    Content.countDocuments({ type: "event" }),
    Content.countDocuments({ type: "announcement" }),
    Content.countDocuments({ type: "assignment" }),
    Report.countDocuments({ status: "pending" }),
  ]);

  res.json({
    students,
    studentAdmins,
    teacherAdmins,
    hods,
    edpUsers,
    superAdmins,
    pending,
    approved,
    rejected,
    notes,
    posts,
    events,
    announcements,
    assignments,
    reports,
  });
};

const exactText = (value) => new RegExp(`^${String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
const sameText = (a = "", b = "") => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

export const getUsers = async (req, res) => {
  let query = {};
  if (req.user.role === "edp") query = { role: { $in: ["student", "student_admin"] } };
  if (req.user.role === "hod") query = { department: exactText(req.user.department), role: { $in: ["student", "student_admin", "teacher", "teacher_admin", "hod"] } };
  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (req.user.role === "edp" && user && !["student", "student_admin"].includes(user.role)) return res.status(403).json({ message: "EDP can access student records only" });
  if (req.user.role === "hod" && user && (!sameText(user.department, req.user.department) || !["student", "student_admin", "teacher", "teacher_admin", "hod"].includes(user.role))) return res.status(403).json({ message: "HOD can access only own-department people." });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const updateUserAcademic = async (req, res) => {
  const allowed = [
    "name",
    "rollNumber",
    "employeeId",
    "role",
    "department",
    "programme",
    "year",
    "semester",
    "section",
    "groupType",
    "groupName",
    "labBatch",
    "electiveGroup",
    "specialization",
    "admissionYear",
    "designation",
    "isSuspended",
  ];

  const updates = {};

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.user.role === "edp") {
    delete updates.role;
    const target = await User.findById(req.params.id).select("role");
    if (!target || !["student", "student_admin"].includes(target.role)) return res.status(403).json({ message: "EDP can update student master data only" });
  }

  if (req.user.role === "hod") {
    delete updates.role;
    const target = await User.findById(req.params.id).select("role department");
    if (!target || !["student", "student_admin"].includes(target.role) || !sameText(target.department, req.user.department)) {
      return res.status(403).json({ message: "HOD can update only student records from their own department." });
    }
    updates.department = target.department;
  }

  if (updates.role && req.user.role !== "super_admin") {
    return res.status(403).json({
      message: "Only Super Admin can change roles",
    });
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (updates.role) {
    await Notification.create({
      user: user._id,
      title: "Role Updated",
      message: `Your role has been updated to ${updates.role}.`,
    });
  }

  res.json(user);
};

export const updateRole = async (req, res) => {
  req.body = { role: req.body.role };
  return updateUserAcademic(req, res);
};

export const getAuditLogs = async (req, res) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Super Admin only" });
  }

  const logs = await AuditLog.find()
    .populate("student", "name email department")
    .populate("admin", "name role")
    .populate("content", "title type")
    .sort({ createdAt: -1 });

  res.json(logs);
};
