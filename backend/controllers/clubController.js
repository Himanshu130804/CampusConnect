import Club from "../models/Club.js";

const canCreateApproved = (user) => ["teacher", "teacher_admin", "hod", "super_admin"].includes(user?.role);
const canApproveClub = (user) => ["teacher", "teacher_admin", "hod", "super_admin"].includes(user?.role);

export const createClub = async (req, res) => {
  const createdByStudentAdmin = req.user?.role === "student_admin";
  const club = await Club.create({
    ...req.body,
    createdBy: req.user._id,
    coordinator: req.body.coordinator || (canCreateApproved(req.user) ? req.user._id : undefined),
    status: createdByStudentAdmin ? "pending" : "approved",
    approvedBy: createdByStudentAdmin ? undefined : req.user._id,
  });
  res.status(201).json(club);
};

export const getClubs = async (req, res) => {
  const filter = {};
  if (!canApproveClub(req.user)) filter.status = "approved";
  const clubs = await Club.find(filter)
    .populate("coordinator", "name email role department")
    .populate("createdBy", "name email role department")
    .populate("approvedBy", "name email role department")
    .sort({ status: 1, name: 1 });
  res.json(clubs);
};

export const reviewClub = async (req, res) => {
  if (!canApproveClub(req.user)) return res.status(403).json({ message: "Teacher in-charge, Teacher Admin, HOD or Super Admin approval required." });
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: "Club not found" });
  club.status = req.body.status === "rejected" ? "rejected" : "approved";
  club.approvedBy = req.user._id;
  if (club.status === "approved" && !club.coordinator) club.coordinator = req.user._id;
  await club.save();
  res.json(club);
};

export const joinClub = async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: "Club not found" });
  if (club.status !== "approved") return res.status(400).json({ message: "Club is not approved yet" });

  if (!club.members.some((id) => String(id) === String(req.user._id))) {
    club.members.push(req.user._id);
    await club.save();
  }

  res.json(club);
};

export const addClubEvent = async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: "Club not found" });

  club.events.push(req.body);
  await club.save();

  res.status(201).json(club);
};
