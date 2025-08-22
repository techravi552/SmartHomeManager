// backend/routes/deviceRoutes.js
import express from "express";
import Device from "../models/Device.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add device
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type, room, powerRating, features } = req.body;
    if (!name || !type || !room) {
      return res.status(400).json({ message: "Name, type and room are required" });
    }

    const device = new Device({ name, type, room, powerRating, features });
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding device", error: error.message });
  }
});

// Update device (features or status)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating device", error: error.message });
  }
});

export default router;
