// backend/controllers/energyController.js
import Device from "../models/Device.js";
import Room from "../models/Room.js";
import Household from "../models/Household.js";
import mongoose from "mongoose";

const toDate = (v, def) => (v ? new Date(v) : def);

export const startUsage = async (req, res) => {
  try {
    const { id } = req.params; // deviceId
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    // If already running, ignore duplicate start
    const running = device.sessions.find((s) => !s.end);
    if (running) return res.json({ message: "Session already running", device });

    device.sessions.push({ start: new Date() });
    device.status = "on";
    await device.save();
    res.json(device);
  } catch (e) {
    res.status(500).json({ message: "Start usage failed", error: e.message });
  }
};

export const stopUsage = async (req, res) => {
  try {
    const { id } = req.params; // deviceId
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    const running = device.sessions.find((s) => !s.end);
    if (!running) return res.status(400).json({ message: "No running session" });

    running.end = new Date();
    const ms = new Date(running.end) - new Date(running.start);
    running.durationMinutes = Math.max(0, Math.round(ms / 60000));

    // energy (kWh) = power(W) * time(hr) / 1000
    const hours = running.durationMinutes / 60;
    running.energyKWh = ((device.powerRating || 0) * hours) / 1000;

    device.status = "off";
    await device.save();
    res.json(device);
  } catch (e) {
    res.status(500).json({ message: "Stop usage failed", error: e.message });
  }
};

// GET /api/energy-usage?householdId=&roomId=&from=&to=
export const getEnergyReport = async (req, res) => {
  try {
    const { householdId, roomId, from, to } = req.query;
    const fromDate = toDate(from, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // default last 7d
    const toDateVal = toDate(to, new Date());

    // Filter devices by household/room if present
    const roomMatch = {};
    if (roomId) roomMatch._id = new mongoose.Types.ObjectId(roomId);
    if (householdId) roomMatch.household = new mongoose.Types.ObjectId(householdId);

    const pipeline = [
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      ...(householdId || roomId ? [{ $match: { "room": roomMatch } }] : []),
      {
        $addFields: {
          sessionsInRange: {
            $filter: {
              input: "$sessions",
              as: "s",
              cond: {
                $and: [
                  { $gte: ["$$s.start", fromDate] },
                  { $lte: ["$$s.start", toDateVal] },
                  { $ne: ["$$s.end", null] }, // completed sessions only
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          type: 1,
          powerRating: 1,
          roomName: "$room.name",
          household: "$room.household",
          sessionsInRange: 1,
        },
      },
      {
        $addFields: {
          totalMinutes: { $sum: "$sessionsInRange.durationMinutes" },
          totalKWh: { $sum: "$sessionsInRange.energyKWh" },
          sessionsCount: { $size: "$sessionsInRange" },
        },
      },
      { $sort: { totalKWh: -1 } },
    ];

    const rows = await Device.aggregate(pipeline);

    // total
    const totalKWh = rows.reduce((a, b) => a + (b.totalKWh || 0), 0);
    res.json({ from: fromDate, to: toDateVal, totalKWh, rows });
  } catch (e) {
    res.status(500).json({ message: "Report failed", error: e.message });
  }
};
