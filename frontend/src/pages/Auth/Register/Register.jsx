import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    accountType: "student",
    name: "",
    email: "",
    password: "",
    department: "",
    rollNumber: "",
    semester: "",
    employeeId: "",
    designation: "",
    teacherCode: "",
  });

  const navigate = useNavigate();

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.department.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (form.accountType === "student" && !form.rollNumber.trim()) {
      alert("Roll number is required for student registration.");
      return;
    }

    if (form.accountType === "teacher") {
      if (!form.employeeId.trim() || !form.designation.trim() || !form.teacherCode.trim()) {
        alert("Employee ID, designation and teacher code are required for teacher registration.");
        return;
      }
    }

    try {
      await registerUser(form);
      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-intro">
          <span>CampusConnect</span>
          <h1>Create your account</h1>
          <p>
            Students can register directly. Teacher registration is protected
            and requires a college-provided teacher code.
          </p>
        </div>

        <form className="register-form" onSubmit={submit}>
          <div className="account-toggle">
            <button
              type="button"
              className={form.accountType === "student" ? "active" : ""}
              onClick={() => update("accountType", "student")}
            >
              Student
            </button>

            <button
              type="button"
              className={form.accountType === "teacher" ? "active" : ""}
              onClick={() => update("accountType", "teacher")}
            >
              Teacher
            </button>
          </div>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
          />

          {form.accountType === "student" ? (
            <>
              <input
                placeholder="Roll Number"
                value={form.rollNumber}
                onChange={(e) => update("rollNumber", e.target.value)}
              />

              <input
                placeholder="Semester"
                value={form.semester}
                onChange={(e) => update("semester", e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={(e) => update("employeeId", e.target.value)}
              />

              <input
                placeholder="Designation"
                value={form.designation}
                onChange={(e) => update("designation", e.target.value)}
              />

              <input
                placeholder="Teacher Registration Code"
                value={form.teacherCode}
                onChange={(e) => update("teacherCode", e.target.value)}
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />

          <button className="register-submit">Create Account</button>
        </form>
      </section>
    </main>
  );
};

export default Register;
