import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [devices, setDevices] = useState([]);

  const [newHousehold, setNewHousehold] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newDevice, setNewDevice] = useState({ name: "", type: "" });

  const token = localStorage.getItem("token");

  // ✅ Fetch households
  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/household", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouseholds(res.data);
      } catch (err) {
        console.error("Error fetching households:", err);
      }
    };
    fetchHouseholds();
  }, [token]);

  // ✅ Fetch rooms when household changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHousehold) return;
      try {
        const res = await axios.get("http://localhost:5000/api/rooms", {
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

  // ✅ Fetch devices when room changes
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedRoom) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/devices/${selectedRoom._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDevices(res.data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };
    fetchDevices();
  }, [selectedRoom, token]);

  // ✅ Add household
  const handleAddHousehold = async () => {
    if (!newHousehold) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/household",
        { name: newHousehold },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHouseholds([...households, res.data]);
      setNewHousehold("");
    } catch (err) {
      console.error("Error adding household:", err);
    }
  };

  // ✅ Add room
  const handleAddRoom = async () => {
    if (!newRoom || !selectedHousehold) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rooms",
        { name: newRoom, householdId: selectedHousehold._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms([...rooms, res.data]);
      setNewRoom("");
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  // ✅ Add device
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.type || !selectedRoom) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/devices",
        {
          name: newDevice.name,
          type: newDevice.type,
          roomId: selectedRoom._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices([...devices, res.data]);
      setNewDevice({ name: "", type: "" });
    } catch (err) {
      console.error("Error adding device:", err);
    }
  };

  // ✅ Toggle device ON/OFF
  const handleToggleDevice = async (device) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/devices/${device._id}`,
        { status: device.status === "on" ? "off" : "on" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices(
        devices.map((d) => (d._id === device._id ? res.data : d))
      );
    } catch (err) {
      console.error("Error toggling device:", err);
    }
  };

  // ✅ Delete device
  const handleDeleteDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(devices.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏠 Smart Home Dashboard</h2>

      {/* Household Section */}
      <div>
        <h3>Households</h3>
        <input
          type="text"
          placeholder="New household"
          value={newHousehold}
          onChange={(e) => setNewHousehold(e.target.value)}
        />
        <button onClick={handleAddHousehold}>Add Household</button>
        <ul>
          {households.map((h) => (
            <li
              key={h._id}
              onClick={() => {
                setSelectedHousehold(h);
                setSelectedRoom(null);
                setDevices([]);
              }}
              style={{
                cursor: "pointer",
                fontWeight: selectedHousehold?._id === h._id ? "bold" : "normal",
              }}
            >
              {h.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Rooms Section */}
      {selectedHousehold && (
        <div>
          <h3>Rooms in {selectedHousehold.name}</h3>
          <input
            type="text"
            placeholder="New room"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
          <button onClick={handleAddRoom}>Add Room</button>
          <ul>
            {rooms.map((r) => (
              <li
                key={r._id}
                onClick={() => setSelectedRoom(r)}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedRoom?._id === r._id ? "bold" : "normal",
                }}
              >
                {r.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Devices Section */}
      {selectedRoom && (
        <div>
          <h3>Devices in {selectedRoom.name}</h3>
          <input
            type="text"
            placeholder="Device name"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Device type (bulb/fan/tv)"
            value={newDevice.type}
            onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
          />
          <button onClick={handleAddDevice}>Add Device</button>
          <ul>
            {devices.map((d) => (
              <li key={d._id}>
                {d.name} ({d.type}) -{" "}
                <b style={{ color: d.status === "on" ? "green" : "red" }}>
                  {d.status}
                </b>
                <button onClick={() => handleToggleDevice(d)}>
                  Toggle
                </button>
                <button onClick={() => handleDeleteDevice(d._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
