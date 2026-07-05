import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);
      login(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">🎓</div>
        <h1>CampusConnect Portal</h1>

        <form onSubmit={submit}>
          <label>Email / Roll Number / Employee ID</label>
          <input
            placeholder="Email / Roll Number / Employee ID"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button>Login</button>
        </form>

        <button
          className="register-btn"
          type="button"
          onClick={() => navigate("/register")}
        >
          New Registration
        </button>
      </section>
    </main>
  );
};

export default Login;
