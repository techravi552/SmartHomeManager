import express from "express";
import Device from "../models/Device.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add device
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type, roomId } = req.body;

    if (!name || !type || !roomId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const device = new Device({ name, type, roomId });
    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Error adding device", error });
  }
});

// ✅ Get devices by room
router.get("/:roomId", authMiddleware, async (req, res) => {
  try {
    const devices = await Device.find({ roomId: req.params.roomId });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching devices", error });
  }
});

// ✅ Update device (status / name / type)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Error updating device", error });
  }
});

// ✅ Delete device
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: "Device deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting device", error });
  }
});

export default router;
