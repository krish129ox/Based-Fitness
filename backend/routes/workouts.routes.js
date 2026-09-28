import { Router } from "express";
import { createWorkout, deleteWorkout, listWorkouts } from "../controllers/workouts.controller.js";
import protect from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";

const router = Router();

router.post("/", protect, asyncHandler(createWorkout));
router.get("/", protect, asyncHandler(listWorkouts));
router.delete("/:id", protect, asyncHandler(deleteWorkout));

export default router;
