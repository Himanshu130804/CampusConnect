import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import connectDB from "./config/db.js";
import { seedDefaultData } from "./utils/seedDefaultData.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import academicRoutes from "./routes/academicRoutes.js";
import chargeRoutes from "./routes/chargeRoutes.js";
import facultyRequestRoutes from "./routes/facultyRequestRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { sanitizeBody, securityHeaders } from "./middleware/securityMiddleware.js";

dotenv.config();
await connectDB();
await seedDefaultData();

const app = express();

const normalizeOrigin = (origin = "") => String(origin).trim().replace(/\/$/, "");

const allowedOrigins = [
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
  "http://localhost:5173",
  "http://localhost:3000",
].map(normalizeOrigin);

const corsOptions = {
  origin(origin, cb) {
    const cleanOrigin = normalizeOrigin(origin);

    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(cleanOrigin)) return cb(null, true);
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(cleanOrigin)) return cb(null, true);

    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(securityHeaders);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "3mb" }));
app.use(sanitizeBody);
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => res.json({ success: true, message: "CampusConnect Backend Running" }));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/charges", chargeRoutes);
app.use("/api/faculty-requests", facultyRequestRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
