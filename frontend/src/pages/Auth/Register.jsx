import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { getRegistrationAcademicOptions } from "../../api/academicApi";
import "./Register.css";

const emptyOptions = { departments: [], programmes: [], years: [], semesters: [], sections: [] };
const semesterForYear = (semesterName = "", yearName = "") => {
  const sem = Number(String(semesterName).match(/\d+/)?.[0] || 0);
  const year = Number(String(yearName).match(/\d+/)?.[0] || 0);
  if (!sem || !year) return true;
  return sem === year * 2 - 1 || sem === year * 2;
};

const Register = () => {
  const [form, setForm] = useState({
    accountType: "student",
    name: "",
    email: "",
    password: "",
    department: "",
    programme: "",
    year: "",
    semester: "",
    section: "",
    rollNumber: "",
    employeeId: "",
    designation: "",
    teacherCode: "",
    accessKey: "",
  });

  const [options, setOptions] = useState(emptyOptions);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRegistrationAcademicOptions({ department: form.department, programme: form.programme });
        setOptions({ ...emptyOptions, ...data });
      } catch (error) {
        console.error("Unable to load academic registration options", error);
      }
    };
    load();
  }, [form.department, form.programme]);

  const programmes = useMemo(() => {
    if (!form.department) return [];
    return (options.programmes || []).filter((item) => !item.department || item.department === form.department);
  }, [options.programmes, form.department]);

  const update = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "department") {
        next.programme = "";
        next.year = "";
        next.semester = "";
        next.section = "";
      }
      if (key === "programme") {
        next.year = "";
        next.semester = "";
        next.section = "";
      }
      if (key === "year") {
        next.semester = "";
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.department.trim()) {
      alert("Please fill name, email, password and department.");
      return;
    }

    if (form.accountType === "student") {
      if (!form.rollNumber.trim() || !form.programme || !form.year || !form.semester || !form.section) {
        alert("Student registration requires roll number, programme, year, semester and section from the official dropdowns.");
        return;
      }
    }

    if (form.accountType === "teacher") {
      if (!form.employeeId.trim() || !form.designation.trim() || !form.teacherCode.trim()) {
        alert("Employee ID, designation and teacher code are required.");
        return;
      }
    }

    if (form.accountType === "edp") {
      if (!form.employeeId.trim() || !form.designation.trim() || !form.accessKey.trim()) {
        alert("Employee ID, designation and EDP access key are required.");
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

  const Select = ({ value, onChange, children, required = true }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
      {children}
    </select>
  );

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-intro">
          <span>CampusConnect</span>
          <h1>Create your account</h1>
          <p>
            Departments now come from Academic Master, so CSE and Computer Science and Engineering stay as one official department everywhere.
          </p>
        </div>

        <form className="register-form" onSubmit={submit}>
          <div className="account-toggle">
            <button type="button" className={form.accountType === "student" ? "active" : ""} onClick={() => update("accountType", "student")}>Student</button>
            <button type="button" className={form.accountType === "teacher" ? "active" : ""} onClick={() => update("accountType", "teacher")}>Teacher</button>
            <button type="button" className={form.accountType === "edp" ? "active" : ""} onClick={() => update("accountType", "edp")}>EDP</button>
          </div>

          <input placeholder="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />

          <Select value={form.department} onChange={(value) => update("department", value)}>
            <option value="">Select Department</option>
            {(options.departments || []).map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
          </Select>

          {form.accountType === "student" ? (
            <>
              <Select value={form.programme} onChange={(value) => update("programme", value)}>
                <option value="">Select Programme</option>
                {programmes.map((item) => <option key={`${item.name}-${item.department}`} value={item.name}>{item.name}</option>)}
              </Select>

              <div className="register-grid-2">
                <Select value={form.year} onChange={(value) => update("year", value)}>
                  <option value="">Select Year</option>
                  {(options.years || []).map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
                </Select>
                <Select value={form.semester} onChange={(value) => update("semester", value)}>
                  <option value="">Select Semester</option>
                  {(options.semesters || []).filter((item) => semesterForYear(item.name, form.year)).map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
                </Select>
              </div>

              <div className="register-grid-2">
                <Select value={form.section} onChange={(value) => update("section", value)}>
                  <option value="">Select Section</option>
                  {(options.sections || []).map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
                </Select>
                <input placeholder="Roll Number" value={form.rollNumber} onChange={(e) => update("rollNumber", e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <input placeholder="Employee ID" value={form.employeeId} onChange={(e) => update("employeeId", e.target.value)} />
              <input placeholder="Designation" value={form.designation} onChange={(e) => update("designation", e.target.value)} />

              {form.accountType === "edp" ? (
                <input placeholder="EDP Access Key" value={form.accessKey} onChange={(e) => update("accessKey", e.target.value)} />
              ) : (
                <input placeholder="Teacher Registration Code" value={form.teacherCode} onChange={(e) => update("teacherCode", e.target.value)} />
              )}
            </>
          )}

          <input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} />
          <button className="register-submit">Create Account</button>
        </form>
      </section>
    </main>
  );
};

export default Register;
