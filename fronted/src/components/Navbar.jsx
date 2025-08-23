// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <nav className="nav">
      <div className="brand">SmartHome</div>
      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/routines">Routines</Link>
        <Link to="/energy">Energy</Link>
        <Link to="/Emargensy">Emargensy</Link>
        
        <Link to="/AddDeviceForm">AddDeviceForm</Link>
        <Link to="/DeviceGroups">DeviceGroups</Link>
        
        <Link to="/DeviceStatus">DeviceStatus</Link>
        
        
      </div>
      <button className="logout" onClick={logout}>Logout</button>
    </nav>
  );
}
