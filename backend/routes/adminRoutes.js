import express from "express";
import {
  getAuditLogs,
  getStats,
  getUserById,
  getUsers,
  updateRole,
  updateUserAcademic,
} from "../controllers/adminController.js";
import { allowAdmins, allowSuperAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, allowAdmins, getStats);
router.get("/users", protect, allowAdmins, getUsers);
router.get("/users/:id", protect, allowAdmins, getUserById);
router.put("/users/:id", protect, allowAdmins, updateUserAcademic);
router.put("/users/:id/role", protect, allowSuperAdmin, updateRole);
router.get("/audit-logs", protect, allowSuperAdmin, getAuditLogs);

export default router;
