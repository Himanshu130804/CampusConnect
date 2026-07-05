import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

const normalizeText = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const departmentAliases = {
  cse: "Computer Science and Engineering",
  "computer science": "Computer Science and Engineering",
  "computer science engineering": "Computer Science and Engineering",
  "computer science and engineering": "Computer Science and Engineering",
  it: "Information Technology",
  "information technology": "Information Technology",
  ece: "Electronics and Communication Engineering",
  "electronics and communication": "Electronics and Communication Engineering",
  "electronics and communication engineering": "Electronics and Communication Engineering",
  ee: "Electrical Engineering",
  "electrical engineering": "Electrical Engineering",
  mech: "Mechanical Engineering",
  mechanical: "Mechanical Engineering",
  "mechanical engineering": "Mechanical Engineering",
  civil: "Civil Engineering",
  "civil engineering": "Civil Engineering",
  bca: "Computer Applications",
  mca: "Computer Applications",
  "computer applications": "Computer Applications",
  management: "Management Studies",
  "management studies": "Management Studies",
  commerce: "Commerce",
  arts: "Arts and Humanities",
  "arts and humanities": "Arts and Humanities",
  science: "Basic Sciences",
  "basic sciences": "Basic Sciences",
};

const canonicalDepartment = (value = "") => {
  const normalized = normalizeText(value);
  return departmentAliases[normalized] || String(value).trim();
};

const buildUserResponse = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  rollNumber: user.rollNumber,
  employeeId: user.employeeId,
  department: user.department,
  programme: user.programme,
  year: user.year,
  semester: user.semester,
  section: user.section,
  groupType: user.groupType,
  groupName: user.groupName,
  labBatch: user.labBatch,
  electiveGroup: user.electiveGroup,
  specialization: user.specialization,
  profilePhoto: user.profilePhoto,
  charges: user.charges || [],
  token: generateToken(user._id),
});

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    accountType,
    teacherCode,
    accessKey,
    rollNumber,
    employeeId,
    department,
    programme,
    year,
    semester,
    section,
    admissionYear,
    designation,
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const finalDepartment = canonicalDepartment(department);

  if (!name || !email || !password || !finalDepartment) {
    return res.status(400).json({
      message: "Name, email, password and department are required",
    });
  }

  if (!emailRegex.test(String(email).toLowerCase())) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });

  if (exists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  let role = "student";

  if (accountType === "hod") {
    return res.status(403).json({ message: "HOD accounts are appointed by Super Admin from verified teachers. Please register as teacher first." });
  }

  if (accountType === "teacher") {
    if (!process.env.TEACHER_REGISTRATION_CODE) {
      return res.status(500).json({
        message: "Teacher registration is not configured",
      });
    }

    if (teacherCode !== process.env.TEACHER_REGISTRATION_CODE) {
      return res.status(403).json({
        message: "Invalid teacher registration code",
      });
    }

    if (!employeeId || !designation) {
      return res.status(400).json({
        message: "Employee ID and designation are required for teacher registration",
      });
    }

    role = "teacher";
  }

  if (accountType === "edp") {
    if (!process.env.EDP_REGISTRATION_KEY) {
      return res.status(500).json({ message: "EDP registration is not configured" });
    }
    if (accessKey !== process.env.EDP_REGISTRATION_KEY) {
      return res.status(403).json({ message: "Invalid EDP access key" });
    }
    if (!employeeId || !designation) {
      return res.status(400).json({ message: "Employee ID and designation are required for EDP registration" });
    }
    role = "edp";
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    rollNumber,
    employeeId,
    department: finalDepartment,
    programme,
    year,
    semester,
    section,
    admissionYear,
    designation,
  });

  res.status(201).json(buildUserResponse(user));
};

export const login = async (req, res) => {
  const { email, identifier, password } = req.body;

  const loginId = String(identifier || email || "").trim();

  if (!loginId || !password) {
    return res.status(400).json({
      message: "Email/Roll No/Employee ID and password are required",
    });
  }

  const user = await User.findOne({
    $or: [
      { email: loginId.toLowerCase() },
      { rollNumber: loginId },
      { employeeId: loginId },
    ],
  });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.isSuspended) {
    return res.status(403).json({ message: "Account suspended" });
  }

  const fixedDepartment = canonicalDepartment(user.department);
  if (fixedDepartment && fixedDepartment !== user.department) {
    user.department = fixedDepartment;
    await user.save();
  }

  res.json(buildUserResponse(user));
};

export const profile = async (req, res) => {
  res.json(req.user);
};
