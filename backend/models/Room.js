import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  household: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
