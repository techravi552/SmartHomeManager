import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [household, setHousehold] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const token = localStorage.getItem("token");

  // API instance
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch household (अगर नहीं है तो नया create कर देगा)
  const fetchHousehold = async () => {
    try {
      const res = await api.get("/household");
      console.log("Household fetched:", res.data);

      if (res.data.length === 0) {
        console.log("⚠️ No household found, creating a new one...");
        const createRes = await api.post("/household", { name: "My Household" });
        setHousehold(createRes.data);
        console.log("✅ Household created:", createRes.data);
      } else {
        setHousehold(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching household:", err);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      if (!household) return;
      const res = await api.get("/rooms");
      setRooms(res.data);
      console.log("Rooms fetched:", res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  // Add new room
  const handleAddRoom = async () => {
    if (!roomName || !household?._id) {
      alert("Please enter room name and make sure household exists.");
      return;
    }

    const payload = { name: roomName, householdId: household._id };
    console.log("Creating room with:", payload);

    try {
      const res = await api.post("/rooms", payload);
      console.log("✅ Room created:", res.data);
      setRooms([...rooms, res.data]);
      setRoomName("");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  useEffect(() => {
    if (household) {
      fetchRooms();
    }
  }, [household]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {household ? (
        <div>
          <p>Household: {household.name}</p>
          <h2 className="mt-4 font-semibold">Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li key={room._id}>{room.name}</li>
            ))}
          </ul>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border p-2"
            />
            <button
              onClick={handleAddRoom}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Room
            </button>
          </div>
        </div>
      ) : (
        <p>Loading household...</p>
      )}
    </div>
  );
};

export default Dashboard;
