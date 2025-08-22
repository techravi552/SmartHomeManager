// backend/routes/energyRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { startUsage, stopUsage, getEnergyReport } from "../controllers/energyController.js";

const router = express.Router();

router.post("/devices/:id/usage/start", authMiddleware, startUsage);
router.post("/devices/:id/usage/stop", authMiddleware, stopUsage);
router.get("/energy-usage", authMiddleware, getEnergyReport);

export default router;
