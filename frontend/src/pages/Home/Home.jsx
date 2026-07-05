import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getGroupedContent } from "../../api/contentApi";
import "./Home.css";

const roleIntro = {
  student: "Access your class timetable, attendance, assignments, notes and campus updates from one clean workspace.",
  student_admin: "Moderate student content, review reports and keep campus communities organised.",
  teacher_admin: "Manage attendance, timetable, notes, assignments, approvals and student communication from one place.",
  super_admin: "Control academics, users, approvals, audit logs and college-wide operations centrally.",
};

const quickLinks = {
  student: [
    ["Dashboard", "/dashboard"], ["Timetable", "/timetable"], ["Attendance", "/attendance"], ["Assignments", "/assignments"], ["Notes", "/notes"], ["Events", "/events"], ["Announcements", "/announcements"], ["Communities", "/communities"],
  ],
  student_admin: [
    ["Dashboard", "/dashboard"], ["Approval Center", "/admin"], ["Reports", "/reports"], ["Manage Users", "/manage-users"], ["Submit Content", "/submit"], ["Communities", "/communities"],
  ],
  teacher_admin: [
    ["Dashboard", "/dashboard"], ["Mark Attendance", "/mark-attendance"], ["Manage Timetable", "/admin-timetable"], ["Submit Content", "/submit"], ["Assignments", "/assignments"], ["Notes", "/notes"], ["Approval Center", "/admin"], ["My Charges", "/my-charges"],
  ],
  super_admin: [
    ["Dashboard", "/dashboard"], ["Manage Users", "/manage-users"], ["Academic Master", "/academic-master"], ["Teacher Charges", "/teacher-charges"], ["Manage Timetable", "/admin-timetable"], ["Audit Logs", "/audit-logs"], ["Reports", "/reports"], ["Approval Center", "/admin"],
  ],
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState({ allUniversity: [], myDepartment: [], allowedOthers: [] });
  const [announcements, setAnnouncements] = useState({ allUniversity: [], myDepartment: [], allowedOthers: [] });

  useEffect(() => {
    if (user) {
      getGroupedContent({ type: "event" }).then(setEvents).catch(() => {});
      getGroupedContent({ type: "announcement" }).then(setAnnouncements).catch(() => {});
    }
  }, [user]);

  const links = quickLinks[user?.role] || quickLinks.student;
  const classLabel = useMemo(() => [user?.department, user?.programme, user?.year, user?.semester, user?.section && `Sec ${user.section}`].filter(Boolean).join(" • "), [user]);

  return (
    <div className="portal-home">
      <section className="welcome-card">
        <span>Home</span>
        <h1>Hello, {user?.name || "Campus user"}</h1>
        <p>{roleIntro[user?.role] || roleIntro.student}</p>
        <div className="home-meta-row">
          <small>{user?.role?.replace("_", " ") || "student"}</small>
          <small>{classLabel || user?.designation || "Academic details not set"}</small>
        </div>
      </section>

      <section className="quick-grid">
        {links.map(([label, to]) => <Link to={to} key={to}>{label}</Link>)}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Latest University Events</h2>
          {events.allUniversity.slice(0, 4).map((item) => <p key={item._id}>{item.title}</p>)}
          {!events.allUniversity.length && <p>No events yet. Teachers and admins can create events from Submit Content.</p>}
        </div>

        <div className="dashboard-card">
          <h2>Latest Announcements</h2>
          {announcements.allUniversity.slice(0, 4).map((item) => <p key={item._id}>{item.title}</p>)}
          {!announcements.allUniversity.length && <p>No announcements yet. Approved announcements will appear here.</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
