// frontend/components/DeviceStatus.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const DeviceStatus = () => {
  const [devices, setDevices] = useState([]);

  // Fetch devices from localStorage
  const fetchDeviceStatus = () => {
    const devicesLS = JSON.parse(localStorage.getItem("devices")) || [];
    const updatedDevices = devicesLS.map((d) => ({
      ...d,
      state: d.status ? d.status : "Malfunction", // if status missing, mark Malfunction
    }));
    setDevices(updatedDevices);
  };

  useEffect(() => {
    fetchDeviceStatus();
    const interval = setInterval(fetchDeviceStatus, 10000); // update every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>🔌 Device Status & Feedback</h2>
        <ul>
          {devices.map((d) => (
            <li key={d.id}>
              <strong>{d.name} ({d.type}):</strong>{" "}
              <span
                style={{
                  color:
                    d.state === "ON"
                      ? "green"
                      : d.state === "Standby"
                      ? "orange"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {d.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DeviceStatus;
