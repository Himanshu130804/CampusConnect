import express from "express";
import multer from "multer";
import path from "path";
import {
  createAssignment,
  getAssignments,
  getMyAssignments,
  gradeSubmission,
  submitAssignment,
  toggleSaveAssignment,
} from "../controllers/assignmentController.js";
import { allowAcademicAdmins, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const allowedExt = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".webp", ".zip"];
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, "uploads"); },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) return cb(new Error("Unsupported file type"));
    cb(null, true);
  },
});

router.get("/", protect, getAssignments);
router.get("/me", protect, getMyAssignments);
router.post("/", protect, allowAcademicAdmins, upload.single("file"), createAssignment);
router.post("/:id/submit", protect, upload.single("file"), submitAssignment);
router.put("/:id/submissions/:submissionId/grade", protect, allowAcademicAdmins, gradeSubmission);
router.put("/:id/save", protect, toggleSaveAssignment);

export default router;
