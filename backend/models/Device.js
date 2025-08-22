// backend/models/Device.js
import mongoose from "mongoose";

const usageSessionSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    energyKWh: { type: Number, default: 0 },
  },
  { _id: false }
);

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // fan, lamp, thermostat
    status: { type: String, enum: ["on", "off"], default: "off" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    powerRating: { type: Number, default: 60 },
    isConnected: { type: Boolean, default: false },
    features: { type: mongoose.Schema.Types.Mixed, default: {} }, // NEW: configurable features
    sessions: [usageSessionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
