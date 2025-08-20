import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createRoom, getRooms, updateRoom, deleteRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.get("/:householdId", authMiddleware, getRooms);
router.put("/:id", authMiddleware, updateRoom);
router.delete("/:id", authMiddleware, deleteRoom);

export default router;
