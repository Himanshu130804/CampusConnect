import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const hasCharge = (user, type, permission) =>
  Boolean(user?.charges?.some((charge) => charge.isActive !== false && (!type || charge.type === type) && (!permission || charge.permissions?.includes(permission))));

export const isHod = (user) => user?.role === "hod" || hasCharge(user, "hod");
export const isTeacherLike = (user) => ["teacher", "teacher_admin", "hod", "super_admin"].includes(user?.role);
export const isAdminLike = (user) => ["student_admin", "teacher_admin", "hod", "edp", "super_admin"].includes(user?.role);

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "You do not have permission" });
  next();
};

export const allowAdmins = (req, res, next) => {
  if (req.user && isAdminLike(req.user)) return next();
  return res.status(403).json({ message: "Admin access required" });
};

export const allowAcademicAdmins = (req, res, next) => {
  if (req.user && ["teacher", "teacher_admin", "hod", "super_admin"].includes(req.user.role)) return next();
  return res.status(403).json({ message: "Academic staff access required" });
};

export const allowTimetableManagers = (req, res, next) => {
  if (req.user?.role === "super_admin" || req.user?.role === "hod" || hasCharge(req.user, "hod", "manage_timetable")) return next();
  return res.status(403).json({ message: "Only HOD or Super Admin can manage timetable" });
};

export const allowStudentDataManagers = (req, res, next) => {
  if (["edp", "super_admin"].includes(req.user?.role)) return next();
  return res.status(403).json({ message: "Only EDP or Super Admin can manage student master data" });
};

export const allowSuperAdmin = (req, res, next) => {
  if (req.user?.role === "super_admin") return next();
  return res.status(403).json({ message: "Super admin access required" });
};
