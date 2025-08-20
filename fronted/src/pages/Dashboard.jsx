import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [households, setHouseholds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const [householdName, setHouseholdName] = useState("");
  const [editHouseholdId, setEditHouseholdId] = useState(null);

  const [roomName, setRoomName] = useState("");
  const [editRoomId, setEditRoomId] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all households
  const fetchHouseholds = async () => {
    try {
      const res = await api.get("/household");
      setHouseholds(res.data);

      if (res.data.length > 0) {
        setSelectedHousehold(res.data[0]._id);
        fetchRooms(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching households:", err);
    }
  };

  // Fetch rooms by householdId
  const fetchRooms = async (householdId) => {
    try {
      const res = await api.get(`/rooms/${householdId}`);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  // Create or Update Household
  const handleHouseholdSubmit = async () => {
    if (!householdName) return alert("Enter household name");

    try {
      if (editHouseholdId) {
        const res = await api.put(`/household/${editHouseholdId}`, { name: householdName });
        setHouseholds(
          households.map((h) => (h._id === editHouseholdId ? res.data : h))
        );
        setEditHouseholdId(null);
      } else {
        const res = await api.post("/household", { name: householdName });
        setHouseholds([...households, res.data]);
      }
      setHouseholdName("");
    } catch (err) {
      console.error("Error saving household:", err);
    }
  };

  // Delete Household
  const deleteHousehold = async (id) => {
    if (!window.confirm("Delete this household?")) return;
    try {
      await api.delete(`/household/${id}`);
      setHouseholds(households.filter((h) => h._id !== id));
      if (selectedHousehold === id) {
        setSelectedHousehold(null);
        setRooms([]);
      }
    } catch (err) {
      console.error("Error deleting household:", err);
    }
  };

  // Create or Update Room
  const handleRoomSubmit = async () => {
    if (!roomName || !selectedHousehold) return alert("Enter room name");

    try {
      if (editRoomId) {
        const res = await api.put(`/rooms/${editRoomId}`, {
          name: roomName,
          householdId: selectedHousehold,
        });
        setRooms(rooms.map((r) => (r._id === editRoomId ? res.data : r)));
        setEditRoomId(null);
      } else {
        const res = await api.post("/rooms", {
          name: roomName,
          householdId: selectedHousehold,
        });
        setRooms([...rooms, res.data]);
      }
      setRoomName("");
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  // Delete Room
  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏠 Smart Home Dashboard</h2>

      {/* HOUSEHOLD SECTION */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Households</h3>
        <input
          type="text"
          placeholder="Household name"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
        />
        <button onClick={handleHouseholdSubmit}>
          {editHouseholdId ? "Update Household" : "Add Household"}
        </button>

        <ul>
          {households.map((h) => (
            <li key={h._id}>
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: h._id === selectedHousehold ? "bold" : "normal",
                }}
                onClick={() => {
                  setSelectedHousehold(h._id);
                  fetchRooms(h._id);
                }}
              >
                {h.name}
              </span>
              <button onClick={() => {
                setEditHouseholdId(h._id);
                setHouseholdName(h.name);
              }}>✏️</button>
              <button onClick={() => deleteHousehold(h._id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>

      {/* ROOM SECTION */}
      {selectedHousehold && (
        <div>
          <h3>Rooms in selected household</h3>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={handleRoomSubmit}>
            {editRoomId ? "Update Room" : "Add Room"}
          </button>

          <ul>
            {rooms.map((r) => (
              <li key={r._id}>
                {r.name}
                <button onClick={() => {
                  setEditRoomId(r._id);
                  setRoomName(r.name);
                }}>✏️</button>
                <button onClick={() => deleteRoom(r._id)}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
