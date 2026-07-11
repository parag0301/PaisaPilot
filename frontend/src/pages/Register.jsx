import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/users/register", form);

      // Save token and user after successful registration
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Account created! Welcome, ${res.data.user.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">✈ PaisaPilot</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Start tracking your money in 30 seconds.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Your name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Parag"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-content">
            <div className="panel-quote">
              "The best time to track money was yesterday. The second best time
              is right now."
            </div>
            <div className="panel-sub">
              One quick signup. A clearer view of your money.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
