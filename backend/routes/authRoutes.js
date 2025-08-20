import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);

// 👇 default export करना ज़रूरी है
export default router;
