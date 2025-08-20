import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";
// import roomRoutes from "./routes/roomRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/household", householdRoutes);
// app.use("/api/rooms", roomRoutes);
app.use("/api/rooms", roomRoutes); 

// Test Route
app.get("/", (req, res) => {
  res.send("SmartHome API is running...")
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
