import express from "express";
import multer from "multer";
import path from "path";

import {
  addComment,
  createContent,
  getApprovedContent,
  getGroupedFeed,
  getMyContent,
  getPendingContent,
  getSavedContent,
  getVisibleFeed,
  reviewContent,
  toggleLike,
  toggleSave,
} from "../controllers/contentController.js";

import { allowAdmins, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedExt = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) return cb(new Error("Unsupported file type"));
    cb(null, true);
  },
});

router.get("/", getApprovedContent);
router.get("/visible", protect, getVisibleFeed);
router.get("/grouped", protect, getGroupedFeed);
router.get("/me", protect, getMyContent);
router.get("/saved", protect, getSavedContent);
router.post("/", protect, upload.single("file"), createContent);
router.get("/pending", protect, allowAdmins, getPendingContent);
router.put("/:id/review", protect, allowAdmins, reviewContent);
router.put("/:id/like", protect, toggleLike);
router.put("/:id/save", protect, toggleSave);
router.post("/:id/comments", protect, addComment);

export default router;
