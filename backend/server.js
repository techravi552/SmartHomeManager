import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import routineRoutes from "./routes/routineRoutes.js";
import energyRoutes from "./routes/energyRoutes.js";
import { reloadAllRoutines } from "./utils/routineScheduler.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/household", householdRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api", energyRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)

  await reloadAllRoutines();
});
