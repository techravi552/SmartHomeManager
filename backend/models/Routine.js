// backend/models/Routine.js
import mongoose from "mongoose";

const RoutineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // optional
    // Scope: 'HOUSEHOLD' or 'ROOM'
    scope: { type: String, enum: ["HOUSEHOLD", "ROOM"], required: true },
    // Daily time in "HH:MM" 24h format (e.g., "22:00")
    time: { type: String, required: true },
    // Action now supports only ON/OFF
    action: { type: String, enum: ["SET_STATUS"], default: "SET_STATUS" },
    payload: {
      status: { type: String, enum: ["on", "off"], required: true },
    },
    // Optional device type filter(s), e.g. ["light","fan"]
    deviceTypes: [{ type: String }],
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Routine", RoutineSchema);
