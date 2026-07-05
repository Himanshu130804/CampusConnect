import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getTodayTimetable } from "../../api/timetableApi";
import "./Dashboard.css";

const roleLabel = { student: "Student Workspace", student_admin: "Student Admin Workspace", teacher: "Teacher Workspace", teacher_admin: "Teacher Admin Workspace", hod: "HOD Workspace", edp: "EDP Workspace", super_admin: "Super Admin Workspace" };
const cardsByRole = {
  student: [["Today's Timetable", "/timetable", "See classes for your section, subgroup, elective and specialization."], ["Attendance", "/attendance", "Review subject-wise percentage."], ["Assignments", "/assignments", "Track due work."], ["Notes Library", "/notes", "Access approved notes."], ["Announcements", "/announcements", "Read targeted notices."]],
  student_admin: [["Approval Center", "/admin", "Moderate assigned content."], ["Reports", "/reports", "Review activity issues."], ["Communities", "/communities", "Organise department communities."], ["Notifications", "/notifications", "Track assigned actions."]],
  teacher: [["Mark Attendance", "/mark-attendance", "Only for classes assigned to you."], ["My Timetable", "/timetable", "View today's and weekly classes."], ["Assignments", "/assignments", "Create and review assigned subject work."], ["Notes", "/notes", "Upload notes for assigned subjects."], ["My Charges", "/my-charges", "View responsibilities assigned by HOD/Super Admin."]],
  teacher_admin: [["Mark Attendance", "/mark-attendance", "Only for assigned classes."], ["My Timetable", "/timetable", "View schedule."], ["Approval Center", "/admin", "Approve content inside your charge."], ["Submit Content", "/submit", "Publish university activity updates."]],
  hod: [["Today's Department Classes", "/admin-timetable", "Monitor department schedule."], ["Teacher Charges", "/teacher-charges", "Assign subjects/classes to teachers."], ["Manage Timetable", "/admin-timetable", "Create/edit department timetable."], ["Department Reports", "/reports", "Review attendance and activities."], ["Approval Center", "/admin", "Approve department content."]],
  edp: [["Student Master", "/manage-users", "Manage student academic records only."], ["Roll Numbers", "/manage-users", "Assign and correct roll numbers."], ["Section & Group Allocation", "/manage-users", "Set section, batch, elective and specialization."], ["Student Reports", "/reports", "Review data status." ]],
  super_admin: [["Manage Users", "/manage-users", "Control roles and records."], ["Academic Master", "/academic-master", "Build hierarchy and mappings."], ["Teacher Charges", "/teacher-charges", "Assign HODs and teaching charges."], ["Manage Timetable", "/admin-timetable", "Central timetable control."], ["Audit Logs", "/audit-logs", "Track changes."], ["Reports", "/reports", "University activity reports."]],
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loadingToday, setLoadingToday] = useState(false);
  const cards = cardsByRole[user?.role] || cardsByRole.student;

  useEffect(() => {
    if (["student", "student_admin", "teacher", "teacher_admin", "hod"].includes(user?.role)) {
      setLoadingToday(true);
      getTodayTimetable().then(setTodayClasses).catch(() => setTodayClasses([])).finally(() => setLoadingToday(false));
    }
  }, [user?.role]);

  const profileCompleteness = [user?.department, user?.programme || user?.designation, user?.rollNumber || user?.employeeId, user?.year || user?.officeHours].filter(Boolean).length;

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div><span>{roleLabel[user?.role] || "Campus Workspace"}</span><h1>Welcome, {user?.name || "User"}</h1><p>CampusConnect now focuses on daily work: today's classes, assigned responsibilities, student records and role-safe actions.</p></div>
        <div className="dashboard-profile-score"><strong>{profileCompleteness}/4</strong><small>Profile readiness</small></div>
      </section>

      <section className="dashboard-insights">
        <div><b>{user?.department || "Not set"}</b><span>Department</span></div><div><b>{user?.programme || user?.designation || "Not set"}</b><span>Programme / Designation</span></div><div><b>{user?.groupName || user?.section || "Not set"}</b><span>Section / Group</span></div><div><b>{user?.role || "student"}</b><span>Access role</span></div>
      </section>

      {["student", "student_admin", "teacher", "teacher_admin", "hod"].includes(user?.role) && <section className="dashboard-today">
        <div className="today-head"><div><h2>Today's classes</h2><p>{loadingToday ? "Loading schedule..." : todayClasses.length ? "Auto-loaded from timetable." : "No class found for today."}</p></div><Link to={user?.role === "hod" ? "/admin-timetable" : "/timetable"}>Open timetable</Link></div>
        <div className="today-list">{todayClasses.length ? todayClasses.map((item) => <article key={item._id} className="today-class"><b>{item.startTime} - {item.endTime}</b><span>{item.subject}</span><small>{item.programme} • {item.year} • Sem {item.semester} • Sec {item.section} • {item.groupType || "full_section"}: {item.groupName || "All"}</small><small>{item.facultyName || item.faculty?.name || "Faculty"} • Room {item.room || "TBA"}</small></article>) : <div className="today-empty">Your dashboard will show classes automatically once timetable and assignments match your profile.</div>}</div>
      </section>}

      {user?.role === "edp" && <section className="dashboard-today"><div className="today-head"><div><h2>EDP workspace</h2><p>EDP is separate from HOD, clubs and approval work. It manages only student master data.</p></div><Link to="/manage-users">Open student master</Link></div></section>}

      <section className="dashboard-grid">{cards.map(([title, link, description]) => <Link to={link} key={title} className="dashboard-card"><h2>{title}</h2><p>{description}</p><span>Open module →</span></Link>)}</section>
    </main>
  );
};
export default Dashboard;
