import React, { useContext, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./PortalLayout.css";

const roleNames = {
  student: "Student",
  student_admin: "Student Admin",
  teacher: "Teacher",
  teacher_admin: "Teacher Admin",
  hod: "HOD",
  edp: "EDP",
  super_admin: "Super Admin",
};

const commonCampus = [["Events", "/events"], ["Announcements", "/announcements"], ["Communities", "/communities"], ["Clubs", "/clubs"], ["Faculty", "/faculty"]];

const menus = {
  student: [
    ["Student", [["Home", "/"], ["Dashboard", "/dashboard"], ["Profile", "/profile"], ["Programme", "/programme"], ["My Courses", "/courses"]]],
    ["Academic", [["Notes", "/notes"], ["Assignments", "/assignments"], ["Timetable", "/timetable"], ["Attendance", "/attendance"]]],
    ["Campus", commonCampus],
    ["Activity", [["Submit Content", "/submit"], ["Saved", "/saved"], ["Notifications", "/notifications"], ["Reports", "/reports"]]],
  ],
  student_admin: [
    ["Workspace", [["Home", "/"], ["Dashboard", "/dashboard"], ["Profile", "/profile"], ["Notifications", "/notifications"]]],
    ["Moderation", [["Approval Center", "/admin"], ["Reports", "/reports"], ["Manage Users", "/manage-users"], ["My Charges", "/my-charges"]]],
    ["Campus", commonCampus],
    ["Resources", [["Notes", "/notes"], ["Assignments", "/assignments"], ["Saved", "/saved"]]],
  ],
  teacher: [
    ["Teacher", [["Home", "/"], ["Dashboard", "/dashboard"], ["Profile", "/profile"], ["My Charges", "/my-charges"], ["Notifications", "/notifications"]]],
    ["Academic", [["Today's Classes", "/dashboard"], ["Mark Attendance", "/mark-attendance"], ["Assignments", "/assignments"], ["Notes", "/notes"], ["Timetable", "/timetable"]]],
    ["Campus", commonCampus],
  ],
  teacher_admin: [
    ["Teacher", [["Home", "/"], ["Dashboard", "/dashboard"], ["Profile", "/profile"], ["My Charges", "/my-charges"], ["Notifications", "/notifications"]]],
    ["Academic", [["Today's Classes", "/dashboard"], ["Mark Attendance", "/mark-attendance"], ["Assignments", "/assignments"], ["Notes", "/notes"], ["Timetable", "/timetable"]]],
    ["Moderation", [["Approval Center", "/admin"], ["Reports", "/reports"], ["Submit Content", "/submit"]]],
    ["Campus", commonCampus],
  ],
  hod: [
    ["HOD", [["Home", "/"], ["Dashboard", "/dashboard"], ["Profile", "/profile"], ["My Charges", "/my-charges"], ["Notifications", "/notifications"]]],
    ["Department Control", [["Subject Master", "/subject-master"], ["Teacher Charges", "/teacher-charges"], ["Faculty Requests", "/faculty-requests"], ["Manage Timetable", "/admin-timetable"], ["Mark Attendance", "/mark-attendance"], ["Department Reports", "/reports"]]],
    ["Academic", [["Assignments", "/assignments"], ["Notes", "/notes"], ["Faculty", "/faculty"]]],
    ["Campus", commonCampus],
  ],
  edp: [
    ["EDP", [["Home", "/"], ["Dashboard", "/dashboard"], ["Student Master", "/manage-users"], ["Student Reports", "/reports"], ["My Profile", "/profile"], ["Notifications", "/notifications"]]],
    ["Student Records", [["Admissions", "/manage-users"], ["Roll Numbers", "/manage-users"], ["Section Allocation", "/manage-users"], ["Group Allocation", "/manage-users"], ["Electives", "/manage-users"], ["Subject Master", "/subject-master"]]],
  ],
  super_admin: [
    ["Super Admin", [["Home", "/"], ["Dashboard", "/dashboard"], ["Admin Center", "/admin"], ["Manage Users", "/manage-users"], ["Academic Master", "/academic-master"], ["Subject Master", "/subject-master"]]],
    ["Governance", [["Teacher Charges", "/teacher-charges"], ["Faculty Requests", "/faculty-requests"], ["Audit Logs", "/audit-logs"], ["Reports", "/reports"], ["Approval Center", "/admin"]]],
    ["Academic Control", [["Manage Timetable", "/admin-timetable"], ["Attendance Audit", "/mark-attendance"], ["Faculty", "/faculty"], ["Programmes", "/programme"]]],
    ["Campus View", commonCampus],
  ],
};

const PortalLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user?.role || "student";
  const menuGroups = menus[role] || menus.student;
  const pageTitle = useMemo(() => menuGroups.flatMap(([, links]) => links).find(([, path]) => path === location.pathname)?.[0] || "CampusConnect", [location.pathname, menuGroups]);
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="portal-brand"><span className="brand-icon">CC</span><span className="brand-text">CampusConnect</span></div>
        <div className="role-card"><b>{roleNames[role] || "User"}</b><span>{user?.name || "Campus user"}</span></div>
        <nav className="portal-menu" aria-label="Portal navigation">
          {menuGroups.map(([group, links]) => <section key={group}><p>{group}</p>{links.map(([label, to]) => <NavLink key={`${group}-${to}`} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}</section>)}
        </nav>
      </aside>
      {menuOpen && <button className="portal-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <main className="portal-main">
        <header className="portal-topbar">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div className="topbar-title"><h1>{pageTitle}</h1><span>{roleNames[role]} Workspace</span></div>
          <div className="portal-user"><NavLink to="/notifications" className="notification-link">Alerts</NavLink><NavLink to="/profile" className="user-chip"><b>{user?.rollNumber || user?.employeeId || user?.name || "User"}</b><span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span></NavLink><button onClick={handleLogout}>Logout</button></div>
        </header>
        <section className="portal-content"><Outlet /></section>
      </main>
    </div>
  );
};
export default PortalLayout;
