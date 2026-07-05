import express from "express";
import multer from "multer";
import path from "path";

import {
  getMyCourses,
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    cb(null, `profile-${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }

    cb(null, true);
  },
});

router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("profilePhoto"), updateMyProfile);
router.get("/courses", protect, getMyCourses);

export default router;
