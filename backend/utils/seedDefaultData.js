import User from "../models/User.js";

let AcademicMaster = null;

try {
  AcademicMaster = (await import("../models/AcademicMaster.js")).default;
} catch {
  AcademicMaster = null;
}

const normalize = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const seedDefaultData = async () => {
  const superAdminEmail = (
    process.env.SUPER_ADMIN_EMAIL || "admin@campusconnect.com"
  ).toLowerCase();

  const superAdminPassword =
    process.env.SUPER_ADMIN_PASSWORD || "Admin@123";

  const existingSuperAdmin = await User.findOne({
    $or: [
      { role: "super_admin" },
      { email: superAdminEmail },
    ],
  });

  if (!existingSuperAdmin) {
    await User.create({
      name: "Super Admin",
      email: superAdminEmail,
      password: superAdminPassword,
      role: "super_admin",
      department: "Administration",
      programme: "Administration",
      year: "Administration",
      semester: "Administration",
      section: "Administration",
      designation: "System Administrator",
    });

    console.log("Default Super Admin created from .env");
    console.log(`Email: ${superAdminEmail}`);
  } else {
    if (existingSuperAdmin.email === superAdminEmail) {
      existingSuperAdmin.role = "super_admin";
      await existingSuperAdmin.save();

      console.log("Existing .env user confirmed as Super Admin");
    } else {
      console.log("Super Admin already exists");
    }
  }

  if (!AcademicMaster) return;

  const seedItems = [
    { type: "department", name: "Computer Science and Engineering" },
    { type: "department", name: "Information Technology" },
    { type: "department", name: "Electronics and Communication Engineering" },
    { type: "department", name: "Electrical Engineering" },
    { type: "department", name: "Mechanical Engineering" },
    { type: "department", name: "Civil Engineering" },
    { type: "department", name: "Artificial Intelligence and Data Science" },

    { type: "programme", name: "B.Tech" },
    { type: "programme", name: "M.Tech" },
    { type: "programme", name: "BCA" },
    { type: "programme", name: "MCA" },

    // Department-programme mappings. These stop invalid combinations like Mechanical + BCA.
    { type: "programme", name: "B.Tech", department: "Computer Science and Engineering" },
    { type: "programme", name: "M.Tech", department: "Computer Science and Engineering" },
    { type: "programme", name: "BCA", department: "Computer Science and Engineering" },
    { type: "programme", name: "MCA", department: "Computer Science and Engineering" },
    { type: "programme", name: "B.Tech", department: "Information Technology" },
    { type: "programme", name: "M.Tech", department: "Information Technology" },
    { type: "programme", name: "BCA", department: "Information Technology" },
    { type: "programme", name: "MCA", department: "Information Technology" },
    { type: "programme", name: "B.Tech", department: "Artificial Intelligence and Data Science" },
    { type: "programme", name: "M.Tech", department: "Artificial Intelligence and Data Science" },
    { type: "programme", name: "BCA", department: "Artificial Intelligence and Data Science" },
    { type: "programme", name: "B.Tech", department: "Electronics and Communication Engineering" },
    { type: "programme", name: "M.Tech", department: "Electronics and Communication Engineering" },
    { type: "programme", name: "B.Tech", department: "Electrical Engineering" },
    { type: "programme", name: "M.Tech", department: "Electrical Engineering" },
    { type: "programme", name: "B.Tech", department: "Mechanical Engineering" },
    { type: "programme", name: "M.Tech", department: "Mechanical Engineering" },
    { type: "programme", name: "B.Tech", department: "Civil Engineering" },
    { type: "programme", name: "M.Tech", department: "Civil Engineering" },

    { type: "year", name: "1st Year" },
    { type: "year", name: "2nd Year" },
    { type: "year", name: "3rd Year" },
    { type: "year", name: "4th Year" },

    { type: "semester", name: "Semester 1" },
    { type: "semester", name: "Semester 2" },
    { type: "semester", name: "Semester 3" },
    { type: "semester", name: "Semester 4" },
    { type: "semester", name: "Semester 5" },
    { type: "semester", name: "Semester 6" },
    { type: "semester", name: "Semester 7" },
    { type: "semester", name: "Semester 8" },

    { type: "section", name: "A" },
    { type: "section", name: "B" },
    { type: "section", name: "C" },

    {
      type: "subject",
      code: "CSE202C",
      name: "Web & Internet Technologies",
      department: "Computer Science and Engineering",
      programme: "B.Tech",
      year: "2nd Year",
      semester: "Semester 4",
      credits: 3,
      category: "Core",
      teacher: "Faculty",
    },
    {
      type: "subject",
      code: "CSE204C",
      name: "Database Management System",
      department: "Computer Science and Engineering",
      programme: "B.Tech",
      year: "2nd Year",
      semester: "Semester 4",
      credits: 4,
      category: "Core",
      teacher: "Faculty",
    },
    {
      type: "subject",
      code: "CSE206C",
      name: "Operating System",
      department: "Computer Science and Engineering",
      programme: "B.Tech",
      year: "2nd Year",
      semester: "Semester 4",
      credits: 4,
      category: "Core",
      teacher: "Faculty",
    },
    {
      type: "subject",
      code: "CSE208C",
      name: "Computer Networks",
      department: "Computer Science and Engineering",
      programme: "B.Tech",
      year: "2nd Year",
      semester: "Semester 4",
      credits: 4,
      category: "Core",
      teacher: "Faculty",
    },
  ];

  for (const item of seedItems) {
    const normalizedName = normalize(item.name);

    await AcademicMaster.updateOne(
      {
        type: item.type,
        normalizedName,
        department: item.department || "",
        programme: item.programme || "",
        semester: item.semester || "",
      },
      {
        $setOnInsert: {
          ...item,
          normalizedName,
        },
      },
      {
        upsert: true,
      }
    );
  }

  console.log("Default academic data checked");
};