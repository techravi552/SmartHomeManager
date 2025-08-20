import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String, // bulb, fan, tv, ac etc.
    required: true,
  },
  status: {
    type: String,
    enum: ["on", "off"],
    default: "off",
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

const Device = mongoose.model("Device", deviceSchema);
export default Device;
