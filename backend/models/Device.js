// backend/models/Device.js
import mongoose from "mongoose";

const usageSessionSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date }, // null while running
    durationMinutes: { type: Number, default: 0 }, // computed on stop
    energyKWh: { type: Number, default: 0 },       // computed on stop
  },
  { _id: false }
);

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., light, fan, ac
    status: { type: String, enum: ["on", "off"], default: "off" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    // NEW:
    powerRating: { type: Number, default: 60 }, // in Watts; set per device
    sessions: [usageSessionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
