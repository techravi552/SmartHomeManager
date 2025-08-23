// frontend/src/pages/EnergyReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";



import Navbar from "../components/Navbar";
import "../styles/Energy.css";

const API = "https://smarthomemanager.onrender.com/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function EnergyReport() {
  const [households, setHouseholds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [from, setFrom] = useState(() =>
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // load households
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/household`, authHeader());
        setHouseholds(res.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // load rooms for selected household
  useEffect(() => {
    setRooms([]);
    setSelectedRoom("");
    if (!selectedHousehold) return;
    (async () => {
      try {
        const res = await axios.get(`${API}/rooms`, {
          ...authHeader(),
          params: { householdId: selectedHousehold },
        });
        setRooms(res.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedHousehold]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        from: `${from}T00:00:00.000Z`,
        to: `${to}T23:59:59.999Z`,
      };
      if (selectedHousehold) params.householdId = selectedHousehold;
      if (selectedRoom) params.roomId = selectedRoom;

      const res = await axios.get(`${API}/energy-usage`, {
        ...authHeader(),
        params,
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load energy report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHousehold, selectedRoom, from, to]);

  return (
    <>
      <Navbar />
      <div className="energy-wrap">
        <h2>⚡ Energy Usage</h2>

        <div className="filters">
          <div className="row">
            <label>Household</label>
            <select
              value={selectedHousehold}
              onChange={(e) => setSelectedHousehold(e.target.value)}
            >
              <option value="">All</option>
              {households.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <label>Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={!rooms.length}
            >
              <option value="">All</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <label>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="row">
            <label>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <button onClick={fetchReport} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="card">
          {!data ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="summary">
                <b style={{ color: "black" }} >Total (kWh):</b>{" "}
                {Number(data.totalKWh || 0).toFixed(3)} &nbsp;
                <small style={{ color: "black" }}>
                  {new Date(data.from).toLocaleDateString()} →{" "}
                  {new Date(data.to).toLocaleDateString()}
                </small>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Type</th>
                    <th>Room</th>
                    <th>Power (W)</th>
                    <th>Sessions</th>
                    <th>Minutes</th>
                    <th>kWh</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows?.map((r) => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.type}</td>
                      <td>{r.roomName || "-"}</td>
                      <td>{r.powerRating ?? "-"}</td>
                      <td>{r.sessionsCount || 0}</td>
                      <td>{r.totalMinutes || 0}</td>
                      <td>{Number(r.totalKWh || 0).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}
