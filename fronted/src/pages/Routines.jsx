// frontend/src/pages/Routines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // 👈 Navbar import
import "../styles/Routines.css";

const API = "https://smarthomemanager.onrender.com/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const Routines = () => {
  const [households, setHouseholds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [routines, setRoutines] = useState([]);

  const [form, setForm] = useState({
    scope: "HOUSEHOLD",
    time: "22:00",
    status: "off",
    deviceTypesText: "",
  });

  // Load households
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/household`, authHeader());
        setHouseholds(res.data || []);
      } catch (e) {
        console.error("Households load failed", e);
      }
    };
    load();
  }, []);

  // Load rooms for selected household
  useEffect(() => {
    const loadRooms = async () => {
      setRooms([]);
      setSelectedRoom(null);
      if (!selectedHousehold) return;
      try {
        const res = await axios.get(`${API}/rooms`, {
          ...authHeader(),
          params: { householdId: selectedHousehold._id },
        });
        setRooms(res.data || []);
      } catch (e) {
        console.error("Rooms load failed", e);
      }
    };
    loadRooms();
  }, [selectedHousehold]);

  // Load routines (optionally by household)
  const fetchRoutines = async (householdId = null) => {
    try {
      const res = await axios.get(`${API}/routines`, {
        ...authHeader(),
        params: householdId ? { householdId } : {},
      });
      setRoutines(res.data || []);
    } catch (e) {
      console.error("Routines load failed", e);
    }
  };

  useEffect(() => {
    fetchRoutines(selectedHousehold?._id);
  }, [selectedHousehold]);

  const createRoutine = async () => {
    if (!selectedHousehold) return alert("Select a household first");
    if (form.scope === "ROOM" && !selectedRoom)
      return alert("Select a room for ROOM scope");

    const deviceTypes =
      form.deviceTypesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || [];

    const body = {
      householdId: selectedHousehold._id,
      scope: form.scope,
      time: form.time,
      deviceTypes,
      payload: { status: form.status },
      enabled: true,
    };
    if (form.scope === "ROOM") body.roomId = selectedRoom._id;

    try {
      const res = await axios.post(`${API}/routines`, body, authHeader());
      setRoutines([res.data, ...routines]);
      setForm({ ...form, deviceTypesText: "" });
      alert("Routine created & scheduled ✅");
    } catch (e) {
      console.error("Create routine failed", e);
      alert("Failed to create routine");
    }
  };

  const toggleEnable = async (r) => {
    try {
      const res = await axios.put(
        `${API}/routines/${r._id}`,
        { enabled: !r.enabled },
        authHeader()
      );
      setRoutines(routines.map((x) => (x._id === r._id ? res.data : x)));
    } catch (e) {
      console.error("Enable toggle failed", e);
    }
  };

  const updateTime = async (r, newTime) => {
    try {
      const res = await axios.put(
        `${API}/routines/${r._id}`,
        { time: newTime },
        authHeader()
      );
      setRoutines(routines.map((x) => (x._id === r._id ? res.data : x)));
    } catch (e) {
      console.error("Update time failed", e);
    }
  };

  const deleteRoutine = async (id) => {
    if (!confirm("Delete this routine?")) return;
    try {
      await axios.delete(`${API}/routines/${id}`, authHeader());
      setRoutines(routines.filter((x) => x._id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div>
      <Navbar /> {/* 👈 Navbar Added */}
      <div className="routines-wrap">
        <h2>⏰ Routines</h2>

        <div className="box">
          <h3>1) Select Scope</h3>
          <div className="row">
            <label>Household:</label>
            <select
              value={selectedHousehold?._id || ""}
              onChange={(e) => {
                const h = households.find((x) => x._id === e.target.value);
                setSelectedHousehold(h || null);
              }}
            >
              <option value="">-- choose --</option>
              {households.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <label>Scope:</label>
            <select
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
            >
              <option value="HOUSEHOLD">HOUSEHOLD</option>
              <option value="ROOM">ROOM</option>
            </select>
          </div>

          {form.scope === "ROOM" && (
            <div className="row">
              <label>Room:</label>
              <select
                value={selectedRoom?._id || ""}
                onChange={(e) => {
                  const r = rooms.find((x) => x._id === e.target.value);
                  setSelectedRoom(r || null);
                }}
              >
                <option value="">-- choose --</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="box">
          <h3>2) Define Action</h3>
          <div className="row">
            <label>Time (HH:MM):</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <div className="row">
            <label>Status:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="off">Turn OFF</option>
              <option value="on">Turn ON</option>
            </select>
          </div>
          <div className="row">
            <label>Device Types (comma sep.):</label>
            <input
              placeholder="light, fan, tv"
              value={form.deviceTypesText}
              onChange={(e) =>
                setForm({ ...form, deviceTypesText: e.target.value })
              }
            />
          </div>
          <button onClick={createRoutine}>Create Routine</button>
        </div>

        <div className="box">
          <h3>3) Existing Routines</h3>
          {!routines.length && <p>No routines yet.</p>}
          {routines.map((r) => (
            <div
              className={`routine-item ${r.enabled ? "on" : "off"}`}
              key={r._id}
            >
              <div className="meta">
                <b>{r.scope}</b> <span>• {r.time}</span>{" "}
                <span>• {r.payload?.status?.toUpperCase()}</span>{" "}
                {r.deviceTypes?.length ? (
                  <span>• types: {r.deviceTypes.join(", ")}</span>
                ) : (
                  <span>• types: all</span>
                )}
              </div>
              <div className="meta">
                <small>
                  {r.scope === "ROOM"
                    ? `Room: ${r.room}`
                    : `Household: ${r.household}`}
                </small>
              </div>

              <div className="actions">
                <label>Change time:</label>
                <input
                  type="time"
                  defaultValue={r.time}
                  onBlur={(e) => updateTime(r, e.target.value)}
                />
                <button onClick={() => toggleEnable(r)}>
                  {r.enabled ? "Disable" : "Enable"}
                </button>
                <button className="danger" onClick={() => deleteRoutine(r._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Routines;
