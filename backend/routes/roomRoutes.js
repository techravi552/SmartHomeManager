import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createRoom, getRooms } from "../controllers/roomController.js";

const router = express.Router();

// Create Room
router.post("/", authMiddleware, createRoom);

// Get all Rooms of a household
router.get("/", authMiddleware, getRooms);

export default router;
