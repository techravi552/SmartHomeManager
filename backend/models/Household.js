import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Household = mongoose.model("Household", householdSchema);
export default Household;
