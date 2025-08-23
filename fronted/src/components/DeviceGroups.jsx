// frontend/components/DeviceGroups.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const DeviceGroups = () => {
  const [devices, setDevices] = useState([]);
  const [groups, setGroups] = useState({
    "Morning Routine": [],
    "Night Mode": [],
  });
  const [energySuggestions, setEnergySuggestions] = useState([]);

  // Fetch devices from localStorage
  const fetchDevices = () => {
    const devicesLS = JSON.parse(localStorage.getItem("devices")) || [];
    setDevices(devicesLS);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Assign devices to groups (demo logic)
  useEffect(() => {
    const morningDevices = devices.filter(d => d.type !== "thermostat"); // example
    const nightDevices = devices.filter(d => d.type === "lamp"); // example
    setGroups({
      "Morning Routine": morningDevices.map(d => d.id),
      "Night Mode": nightDevices.map(d => d.id),
    });
  }, [devices]);

  // Toggle group devices ON/OFF
  const toggleGroup = (groupName) => {
    const updatedDevices = devices.map(d => {
      if (groups[groupName].includes(d.id)) {
        const newStatus = d.status === "ON" ? "OFF" : "ON";
        return { ...d, status: newStatus };
      }
      return d;
    });
    setDevices(updatedDevices);
    localStorage.setItem("devices", JSON.stringify(updatedDevices));
  };

  // Simple Energy Efficiency Suggestion logic
  useEffect(() => {
    const suggestions = [];
    const nightOnDevices = devices.filter(d => d.status === "ON" && d.type === "lamp");
    if (nightOnDevices.length > 0) {
      suggestions.push("Night Mode: Turn off unused lamps to save energy.");
    }
    const fansOn = devices.filter(d => d.status === "ON" && d.type === "fan");
    if (fansOn.length > 2) {
      suggestions.push("Too many fans ON, consider reducing usage to save electricity.");
    }
    setEnergySuggestions(suggestions);
  }, [devices]);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>📦 Device Groups</h2>
        {Object.keys(groups).map(groupName => (
          <div key={groupName} style={{ marginBottom: "20px" }}>
            <h3>{groupName}</h3>
            <button onClick={() => toggleGroup(groupName)}>
              Toggle {groupName} Devices ON/OFF
            </button>
            <ul>
              {devices
                .filter(d => groups[groupName].includes(d.id))
                .map(d => (
                  <li key={d.id}>
                    {d.name} ({d.type}) - <strong>{d.status || "OFF"}</strong>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <h2>💡 Energy Efficiency Suggestions</h2>
        <ul>
          {energySuggestions.length > 0 ? (
            energySuggestions.map((s, idx) => <li key={idx}>{s}</li>)
          ) : (
            <li>No suggestions for now. ✅</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default DeviceGroups;
