import FacultyProfile from "../models/FacultyProfile.js";
import User from "../models/User.js";

export const createFacultyProfile = async (req, res) => {
  const profile = await FacultyProfile.create(req.body);
  res.status(201).json(profile);
};

export const getFacultyProfiles = async (req, res) => {
  const { department, search } = req.query;
  const filter = {};

  if (department) filter.department = new RegExp(department, "i");

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { subjects: new RegExp(search, "i") },
      { designation: new RegExp(search, "i") },
    ];
  }

  const profiles = await FacultyProfile.find(filter).populate("user", "name email department role profilePhoto designation qualification experience officeHours phone subjects charges").sort({ name: 1 });

  const profileEmails = new Set(profiles.map((p) => String(p.email || p.user?.email || "").toLowerCase()).filter(Boolean));
  const userFilter = { role: { $in: ["teacher", "teacher_admin", "hod"] } };
  if (department) userFilter.department = new RegExp(department, "i");
  if (search) userFilter.$or = [
    { name: new RegExp(search, "i") },
    { department: new RegExp(search, "i") },
    { designation: new RegExp(search, "i") },
    { subjects: new RegExp(search, "i") },
  ];

  const teachers = await User.find(userFilter).select("name email department role profilePhoto designation qualification experience officeHours phone subjects charges bio skills").sort({ name: 1 });
  const fallbackTeachers = teachers
    .filter((teacher) => !profileEmails.has(String(teacher.email || "").toLowerCase()))
    .map((teacher) => ({
      _id: `user-${teacher._id}`,
      user: teacher,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department || "Department pending",
      designation: teacher.designation || (teacher.role === "hod" ? "Head of Department" : "Faculty"),
      subjects: [...new Set([...(teacher.subjects || []), ...((teacher.charges || []).map((c) => c.subject).filter(Boolean))])],
      qualification: teacher.qualification || "Not updated",
      experience: teacher.experience || "Not updated",
      officeHours: teacher.officeHours || "Not updated",
      phone: teacher.phone || "Not updated",
      photo: teacher.profilePhoto || "",
      bio: teacher.bio || "Profile details can be completed by the teacher or admin.",
    }));

  res.json([...profiles, ...fallbackTeachers]);
};

export const updateFacultyProfile = async (req, res) => {
  const profile = await FacultyProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!profile) return res.status(404).json({ message: "Faculty profile not found" });
  res.json(profile);
};
