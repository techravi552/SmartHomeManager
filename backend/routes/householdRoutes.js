import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createHousehold, getHouseholds, updateHousehold, deleteHousehold } from "../controllers/householdController.js";

const router = express.Router();

router.post("/", authMiddleware, createHousehold);
router.get("/", authMiddleware, getHouseholds);
router.put("/:id", authMiddleware, updateHousehold);
router.delete("/:id", authMiddleware, deleteHousehold);

export default router;
