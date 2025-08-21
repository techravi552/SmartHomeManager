// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">SmartHome Manager</h2>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/routines">Routines</Link>
        </li>
        <li>
          <Link to="/login">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
