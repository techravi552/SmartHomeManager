// backend/routes/routineRoutes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createRoutine,
  listRoutines,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routineController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createRoutine);
router.get("/", listRoutines);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;
