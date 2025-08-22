// frontend/components/AddDeviceForm.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AddDeviceForm({ token, roomId, onDeviceAdded }) {
  // Initial states
  const defaultType = "fan";
  const defaultFeatures = { speed: "Low" };

  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType);
  const [features, setFeatures] = useState(defaultFeatures);

  // Handle type change
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    // Reset features based on type
    if (newType === "fan") setFeatures({ speed: "Low" });
    else if (newType === "lamp") setFeatures({ brightness: 50 });
    else if (newType === "thermostat") setFeatures({ temperature: 24 });
  };

  // Handle feature input change
  const handleFeaturesChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/devices",
        { name, type, room: roomId, features },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDeviceAdded(res.data);

      // Reset all fields after submit
      setName("");
      setType(defaultType);
      setFeatures(defaultFeatures);
    } catch (err) {
      console.error("Error adding device:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />

      <form onSubmit={handleSubmit} className="p-4 border rounded mt-4">
        <input
          type="text"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-1 m-1"
        />

        <select
          value={type}
          onChange={handleTypeChange}
          className="border p-1 m-1"
        >
          <option value="fan">Fan</option>
          <option value="lamp">Lamp</option>
          <option value="thermostat">Thermostat</option>
        </select>

        {/* Features UI */}
        {type === "fan" && (
          <select
            name="speed"
            value={features.speed}
            onChange={handleFeaturesChange}
            className="border p-1 m-1"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        )}

        {type === "lamp" && (
          <input
            type="number"
            name="brightness"
            value={features.brightness}
            onChange={handleFeaturesChange}
            min="0"
            max="100"
            className="border p-1 m-1"
          />
        )}

        {type === "thermostat" && (
          <input
            type="number"
            name="temperature"
            value={features.temperature}
            onChange={handleFeaturesChange}
            min="18"
            max="30"
            className="border p-1 m-1"
          />
        )}

        <button type="submit" className="bg-blue-500 text-white p-1 m-1">
          Add Device
        </button>
      </form>
    </>
  );
}
