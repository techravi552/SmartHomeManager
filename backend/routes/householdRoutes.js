import express from "express";
import Household from "../models/Household.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

// Create household
router.post("/", authMiddleware, async (req, res) => {
  try {
    const household = new Household({
      name: req.body.name,
      owner: req.user.id,
      members: [req.user.id],
    });

    await household.save();
    res.json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get household of logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const households = await Household.find({ members: req.user.id });
    res.json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
