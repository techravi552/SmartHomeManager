import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../styles/dashboard.css"; // External CSS import

const Emargensy = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [devices, setDevices] = useState([]);

  const [newHousehold, setNewHousehold] = useState("");
  const [editHousehold, setEditHousehold] = useState(null);

  const [newRoom, setNewRoom] = useState("");
  const [editRoom, setEditRoom] = useState(null);

  const [newDevice, setNewDevice] = useState({ name: "", type: "", features: {} });
  const [editDevice, setEditDevice] = useState(null);

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const token = localStorage.getItem("token");

  // ------------------ Fetch Households ------------------
  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const res = await axios.get("https://smarthomemanager.onrender.com/api/household", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouseholds(res.data);
      } catch (err) {
        console.error("Error fetching households:", err);
      }
    };
    fetchHouseholds();
  }, [token]);

  // ------------------ Fetch Rooms ------------------
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHousehold) return;
      try {
        const res = await axios.get("https://smarthomemanager.onrender.com/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
          params: { householdId: selectedHousehold._id },
        });
        setRooms(res.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, [selectedHousehold, token]);

  // ------------------ Fetch Devices ------------------
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedRoom) return;
      try {
        const res = await axios.get(
          `https://smarthomemanager.onrender.com/api/devices/${selectedRoom._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDevices(res.data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };
    fetchDevices();
  }, [selectedRoom, token]);

  // ------------------ Household CRUD ------------------
  const handleAddHousehold = async () => {
    if (!newHousehold) return;
    try {
      const res = await axios.post(
        "https://smarthomemanager.onrender.com/api/household",
        { name: newHousehold },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHouseholds([...households, res.data]);
      setNewHousehold("");
    } catch (err) {
      console.error("Error adding household:", err);
    }
  };

  const handleUpdateHousehold = async () => {
    if (!editHousehold) return;
    try {
      const res = await axios.put(
        `https://smarthomemanager.onrender.com/api/household/${editHousehold._id}`,
        { name: editHousehold.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHouseholds(
        households.map((h) => (h._id === res.data._id ? res.data : h))
      );
      setEditHousehold(null);
    } catch (err) {
      console.error("Error updating household:", err);
    }
  };

  const handleDeleteHousehold = async (id) => {
    try {
      await axios.delete(`https://smarthomemanager.onrender.com/api/household/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouseholds(households.filter((h) => h._id !== id));
      if (selectedHousehold?._id === id) {
        setSelectedHousehold(null);
        setRooms([]);
        setDevices([]);
      }
    } catch (err) {
      console.error("Error deleting household:", err);
    }
  };

  // ------------------ Room CRUD ------------------
  const handleAddRoom = async () => {
    if (!newRoom || !selectedHousehold) return;
    try {
      const res = await axios.post(
        "https://smarthomemanager.onrender.com/api/rooms",
        { name: newRoom, householdId: selectedHousehold._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms([...rooms, res.data]);
      setNewRoom("");
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  const handleUpdateRoom = async () => {
    if (!editRoom) return;
    try {
      const res = await axios.put(
        `https://smarthomemanager.onrender.com/api/rooms/${editRoom._id}`,
        { name: editRoom.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms(rooms.map((r) => (r._id === res.data._id ? res.data : r)));
      setEditRoom(null);
    } catch (err) {
      console.error("Error updating room:", err);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(`https://smarthomemanager.onrender.com/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(rooms.filter((r) => r._id !== id));
      if (selectedRoom?._id === id) {
        setSelectedRoom(null);
        setDevices([]);
      }
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  // ------------------ Device CRUD ------------------
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.type || !selectedRoom) return;
    try {
      const res = await axios.post(
        "https://smarthomemanager.onrender.com/api/devices",
        { ...newDevice, roomId: selectedRoom._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices([...devices, res.data]);
      setNewDevice({ name: "", type: "", features: {} });
    } catch (err) {
      console.error("Error adding device:", err);
    }
  };

  const handleUpdateDevice = async () => {
    if (!editDevice) return;
    try {
      const res = await axios.put(
        `https://smarthomemanager.onrender.com/api/devices/${editDevice._id}`,
        { name: editDevice.name, type: editDevice.type, features: editDevice.features },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices(devices.map((d) => (d._id === res.data._id ? res.data : d)));
      setEditDevice(null);
    } catch (err) {
      console.error("Error updating device:", err);
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      await axios.delete(`https://smarthomemanager.onrender.com/api/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(devices.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  // ------------------ Toggle Device ------------------
  const handleToggleDevice = async (device) => {
    if (emergencyMode) return;
    const goingOn = device.status !== "on";
    try {
      if (goingOn) {
        await axios.post(
          `https://smarthomemanager.onrender.com/api/devices/${device._id}/usage/start`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `https://smarthomemanager.onrender.com/api/devices/${device._id}/usage/stop`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const res = await axios.get(
        `https://smarthomemanager.onrender.com/api/devices/${selectedRoom._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices(res.data);
    } catch (err) {
      console.error("Error toggling device:", err);
      alert("Toggle failed");
    }
  };

  // ------------------ Emergency Mode ------------------
  const handleToggleEmergency = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      const offDevices = devices.map((d) => ({ ...d, status: "off" }));
      setDevices(offDevices);
    }
  };

  // ------------------ Simulated Usage Prediction ------------------
  useEffect(() => {
    const checkUsagePatterns = () => {
      const now = new Date();
      const hours = now.getHours();
      const newSuggestions = [];

      devices.forEach((device) => {
        if (device.type === "thermostat" && hours === 7) {
          newSuggestions.push(`💡 Suggest to turn on ${device.name} now`);
        }
        if (device.type === "fan" && hours === 8) {
          newSuggestions.push(`💡 Suggest to turn on ${device.name} now`);
        }
      });

      setSuggestions(newSuggestions);
    };

    const interval = setInterval(checkUsagePatterns, 60000);
    return () => clearInterval(interval);
  }, [devices]);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2> 🚨❗⚡ Smart Home Emargensy</h2>

        {/* Emergency Mode Button */}
        <button
          onClick={handleToggleEmergency}
          style={{
            backgroundColor: emergencyMode ? "red" : "green",
            color: "white",
            margin: "10px",
            padding: "5px 10px",
          }}
        >
          {emergencyMode ? "Emergency ON" : "Activate Emergency"}
        </button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <div key={i} style={{ color: "orange" }}>
                {s}
              </div>
            ))}
          </div>
        )}

        {/* Household Section */}
        {/* ...same as your existing code for households, rooms, devices... */}
        {/* Add Device Features UI if you want here */}
      </div>
    </>
  );
};

export default Emargensy;
