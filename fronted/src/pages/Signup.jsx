import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 for navigation
import axios from "axios";
import "./../styles/Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate(); // 👈 hook for redirect

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://smarthomemanager.onrender.com/api/auth/signup", form);
      alert("Signup successful!");
      navigate("/login"); // 👈 redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="signup-container">
      <h2  style={{ color: "black" }} > Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>

      {/* 👇 Already account? go to login */}
      <p className="login-link"  style={{ color: "black" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
