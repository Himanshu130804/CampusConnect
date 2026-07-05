import React, { useEffect, useState } from "react";
import { getUsers, updateUserAcademic } from "../../api/adminApi";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setUsers(await getUsers());
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (user) => {
    setEditing({ ...user });
  };

  const update = (key, value) => {
    setEditing({ ...editing, [key]: value });
  };

  const save = async () => {
    await updateUserAcademic(editing._id, editing);
    alert("User updated");
    setEditing(null);
    load();
  };

  return (
    <div className="manage-users-page">
      <div className="breadcrumb">Home / Manage Users</div>

      <section className="manage-card">
        <h1>Manage Users</h1>
        <p>Admins can update academic details. Only Super Admin should change roles.</p>

        <div className="user-grid">
          {users.map((user) => (
            <article className="user-box" key={user._id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.rollNumber || user.employeeId}</p>
              <p>{user.department} / {user.programme} / {user.year} / {user.semester} / {user.section}</p><p>{user.groupType || "full_section"}: {user.groupName || "All"} {user.electiveGroup ? `• Elective: ${user.electiveGroup}` : ""} {user.specialization ? `• Spl: ${user.specialization}` : ""}</p>
              <strong>{user.role}</strong>
              <button onClick={() => startEdit(user)}>Edit Academic Details</button>
            </article>
          ))}
        </div>
      </section>

      {editing && (
        <section className="edit-modal">
          <div className="edit-card">
            <h2>Edit User</h2>

            <input placeholder="Name" value={editing.name || ""} onChange={(e) => update("name", e.target.value)} />
            <input placeholder="Roll Number" value={editing.rollNumber || ""} onChange={(e) => update("rollNumber", e.target.value)} />
            <input placeholder="Employee ID" value={editing.employeeId || ""} onChange={(e) => update("employeeId", e.target.value)} />

            <select value={editing.role || "student"} onChange={(e) => update("role", e.target.value)}>
              <option value="student">Student</option>
              <option value="student_admin">Student Admin</option>
              <option value="teacher">Teacher</option>
              <option value="teacher_admin">Teacher Admin</option>
              <option value="hod">HOD</option>
              <option value="edp">EDP</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <input placeholder="Department" value={editing.department || ""} onChange={(e) => update("department", e.target.value)} />
            <input placeholder="Programme" value={editing.programme || ""} onChange={(e) => update("programme", e.target.value)} />
            <input placeholder="Year" value={editing.year || ""} onChange={(e) => update("year", e.target.value)} />
            <input placeholder="Semester" value={editing.semester || ""} onChange={(e) => update("semester", e.target.value)} />
            <input placeholder="Section" value={editing.section || ""} onChange={(e) => update("section", e.target.value)} />
            <select value={editing.groupType || "full_section"} onChange={(e) => update("groupType", e.target.value)}><option value="full_section">Full Section</option><option value="sub_group">Sub Group</option><option value="lab_batch">Lab Batch</option><option value="elective">Elective</option><option value="specialization">Specialization</option></select>
            <input placeholder="Group Name (All / A1 / Lab-1)" value={editing.groupName || ""} onChange={(e) => update("groupName", e.target.value)} />
            <input placeholder="Lab Batch" value={editing.labBatch || ""} onChange={(e) => update("labBatch", e.target.value)} />
            <input placeholder="Elective Group" value={editing.electiveGroup || ""} onChange={(e) => update("electiveGroup", e.target.value)} />
            <input placeholder="Specialization" value={editing.specialization || ""} onChange={(e) => update("specialization", e.target.value)} />
            <input placeholder="Admission Year" value={editing.admissionYear || ""} onChange={(e) => update("admissionYear", e.target.value)} />

            <div className="modal-actions">
              <button onClick={save}>Save</button>
              <button className="cancel" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ManageUsers;
