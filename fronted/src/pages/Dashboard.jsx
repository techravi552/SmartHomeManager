import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./../styles/dashboard.css"; // External CSS import

const Dashboard = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [devices, setDevices] = useState([]);

  const [newHousehold, setNewHousehold] = useState("");
  const [editHousehold, setEditHousehold] = useState(null);

  const [newRoom, setNewRoom] = useState("");
  const [editRoom, setEditRoom] = useState(null);

  const [newDevice, setNewDevice] = useState({ name: "", type: "" });
  const [editDevice, setEditDevice] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch households
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

  // Fetch rooms
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

  // Fetch devices
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

  // Household CRUD
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

  const handleUpdateHousehold = async () => {
    if (!editHousehold) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/household/${editHousehold._id}`,
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
      await axios.delete(`http://localhost:5000/api/household/${id}`, {
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

  // Room CRUD
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

  const handleUpdateRoom = async () => {
    if (!editRoom) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/rooms/${editRoom._id}`,
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
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
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

  // Device CRUD
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.type || !selectedRoom) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/devices",
        { ...newDevice, roomId: selectedRoom._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices([...devices, res.data]);
      setNewDevice({ name: "", type: "" });
    } catch (err) {
      console.error("Error adding device:", err);
    }
  };

  const handleUpdateDevice = async () => {
    if (!editDevice) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/devices/${editDevice._id}`,
        { name: editDevice.name, type: editDevice.type },
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
      await axios.delete(`http://localhost:5000/api/devices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(devices.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };
  // in Dashboard.jsx
const handleToggleDevice = async (device) => {
  const goingOn = device.status !== "on";
  try {
    if (goingOn) {
      await axios.post(
        `http://localhost:5000/api/devices/${device._id}/usage/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        `http://localhost:5000/api/devices/${device._id}/usage/stop`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    // refetch devices (or optimistically update)
    const res = await axios.get(
      `http://localhost:5000/api/devices/${selectedRoom._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDevices(res.data);
  } catch (err) {
    console.error("Error toggling device:", err);
    alert("Toggle failed");
  }
};


  return (
    <>
            <Navbar />
    <div className="dashboard">
      <h2>🏠 Smart Home Dashboard</h2>

      {/* Household Section */}
      <div className="section">
        <h3>Households</h3>
        <input
          type="text"
          placeholder="New household"
          value={newHousehold}
          onChange={(e) => setNewHousehold(e.target.value)}
        />
        <button onClick={handleAddHousehold}>Add</button>

        {editHousehold && (
          <div className="edit-box">
            <input
              type="text"
              value={editHousehold.name}
              onChange={(e) =>
                setEditHousehold({ ...editHousehold, name: e.target.value })
              }
            />
            <button onClick={handleUpdateHousehold}>Update</button>
            <button onClick={() => setEditHousehold(null)}>Cancel</button>
          </div>
        )}

        <ul>
          {households.map((h) => (
            <li key={h._id}>
              <span
                onClick={() => {
                  setSelectedHousehold(h);
                  setSelectedRoom(null);
                  setDevices([]);
                }}
                className={
                  selectedHousehold?._id === h._id ? "selected" : ""
                }
              >
                {h.name}
              </span>
              <button onClick={() => setEditHousehold(h)}>Edit</button>
              <button onClick={() => handleDeleteHousehold(h._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Rooms Section */}
      {selectedHousehold && (
        <div className="section">
          <h3>Rooms in {selectedHousehold.name}</h3>
          <input
            type="text"
            placeholder="New room"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
          <button onClick={handleAddRoom}>Add</button>

          {editRoom && (
            <div className="edit-box">
              <input
                type="text"
                value={editRoom.name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, name: e.target.value })
                }
              />
              <button onClick={handleUpdateRoom}>Update</button>
              <button onClick={() => setEditRoom(null)}>Cancel</button>
            </div>
          )}

          <ul>
            {rooms.map((r) => (
              <li key={r._id}>
                <span
                  onClick={() => setSelectedRoom(r)}
                  className={selectedRoom?._id === r._id ? "selected" : ""}
                >
                  {r.name}
                </span>
                <button onClick={() => setEditRoom(r)}>EDIT</button>
                <button onClick={() => handleDeleteRoom(r._id)}>DELETE</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Devices Section */}
      {selectedRoom && (
        <div className="section">
          <h3>Devices in {selectedRoom.name}</h3>
          <input
            type="text"
            placeholder="Device name"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Device type"
            value={newDevice.type}
            onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
          />
          <button onClick={handleAddDevice}>Add</button>

          {editDevice && (
            <div className="edit-box">
              <input
                type="text"
                value={editDevice.name}
                onChange={(e) =>
                  setEditDevice({ ...editDevice, name: e.target.value })
                }
              />
              <input
                type="text"
                value={editDevice.type}
                onChange={(e) =>
                  setEditDevice({ ...editDevice, type: e.target.value })
                }
              />
              <button onClick={handleUpdateDevice}>Update</button>
              <button onClick={() => setEditDevice(null)}>Cancel</button>
            </div>
          )}

          <ul>
            {devices.map((d) => (
              <li key={d._id}>
                {d.name} ({d.type})
                <button onClick={() => setEditDevice(d)}>EDIT</button>
                <button onClick={() => handleDeleteDevice(d._id)}>DELETE</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
};

export default Dashboard;
