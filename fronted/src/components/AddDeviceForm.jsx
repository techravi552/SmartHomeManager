// frontend/components/AddDeviceForm.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AddDeviceForm({ roomId, onDeviceAdded }) {

  const defaultType = "fan";
  const defaultFeatures = { speed: "Low" };

  const [name, setName] = useState("");
  const [type, setType] = useState(defaultType);
  const [features, setFeatures] = useState(defaultFeatures);

  // Handle type change
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    if (newType === "fan") setFeatures({ speed: "Low" });
    else if (newType === "lamp") setFeatures({ brightness: 50, color: "#ffffff" });
    else if (newType === "thermostat") setFeatures({ temperature: 24 });
  };

  // Handle feature input change
  const handleFeaturesChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newDevice = {
      id: Date.now(), // unique id
      name,
      type,
      roomId,
      features,
      status: "standby", 
    };

    // Get existing devices from localStorage
    const devicesLS = JSON.parse(localStorage.getItem("devices")) || []
    devicesLS.push(newDevice);
    localStorage.setItem("devices", JSON.stringify(devicesLS));

    // Call onDeviceAdded if exists
    if (onDeviceAdded) onDeviceAdded(newDevice);

    // Reset form fields
    setName("");
    setType(defaultType);
    setFeatures(defaultFeatures);
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

      <select value={type} onChange={handleTypeChange} className="border p-1 m-1">
        <option value="fan">Fan</option>
        <option value="lamp">Lamp</option>
        <option value="thermostat">Thermostat</option>
      </select>

      {/* Device Features */}
      {type === "fan" && (
        <select name="speed" value={features.speed} onChange={handleFeaturesChange} className="border p-1 m-1">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      )}

      {type === "lamp" && (
        <>
          <input
            type="number"
            name="brightness"
            value={features.brightness}
            onChange={handleFeaturesChange}
            min="0"
            max="100"
            className="border p-1 m-1"
          />
          <input
            type="color"
            name="color"
            value={features.color}
            onChange={handleFeaturesChange}
            className="border p-1 m-1"
          />
        </>
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
