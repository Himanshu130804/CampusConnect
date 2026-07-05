import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    try {
      const data = await loginUser(form);
      login(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="badge">Welcome Back</span>
        <h1>Login to CampusConnect</h1>
        <p>Access your verified academic community.</p>

        <form className="form-grid" onSubmit={submit}>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn">Login</button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
